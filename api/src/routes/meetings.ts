import { orderBy, pick } from 'lodash';
import { body } from 'express-validator';
import add from 'date-fns/add';

import { route } from '../core/request';
import { getSentInvitation, getReceivedInvitation, getOngoingMeeting, createInvitation, updateMeeting } from '../repos/meetings';
import { areUsersNearby } from '../repos/users';
import { isPlaceNearby } from '../repos/places';
import { getAge } from '../services/utils';
import { Meeting } from '../db/schemas/models';
import { ForbiddenError, NotFoundError, InternalError } from '../core/errors';
import { isUserId, isPlaceId } from '../services/validators';
import { meetingsConstants, usersConstants, placesConstants } from '../services/constants';
import { getPolyline } from '../services/geolocation';
import config from '../core/config';
import { getCompatibility } from '../services/matching';
import { emitInvitationAcceptedSocketEvent, emitInvitationReceivedSocketEvent, emitOngoingMeetingFinishedSocketEvent } from '../services/events';
import { notifyAboutAcceptedInvitation, notifyAboutReceivedInvitation } from '../services/notifications';

type TNormalizedMeeting = {
  id: string;
  user: {
    id: string;
    name: string;
    gender: string;
    age: number;
    photos: {
      id: string;
      width: number;
      height: number;
      isDefault: boolean;
      imageUrl: string;
      thumbnailUrl: string;
    }[];
    compatibility: number;
  };
  place: {
    id: string;
    name: string;
    activity: string;
    coordinate: {
      latitude: string;
      longitude: string;
    };
  };
  expirationTime: string;
  polyline: {
    latitude: string;
    longitude: string;
  }[] | null;
};

export default [
  route<TNormalizedMeeting | null>({
    method: 'get',
    path: '/meetings/sent-invitation',
    restricted: true,
    callback: async ({ session }) => {
      const sentInvitation = await getSentInvitation(session.userId);
      if (!sentInvitation) {
        return null;
      }
      return normalizeMeeting(sentInvitation, session.userId);
    },
  }),

  route<TNormalizedMeeting | null>({
    method: 'get',
    path: '/meetings/received-invitation',
    restricted: true,
    callback: async ({ session }) => {
      const receivedInvitation = await getReceivedInvitation(session.userId);
      if (!receivedInvitation) {
        return null;
      }
      return normalizeMeeting(receivedInvitation, session.userId);
    },
  }),

  route<TNormalizedMeeting | null>({
    method: 'get',
    path: '/meetings/ongoing',
    restricted: true,
    callback: async ({ session }) => {
      const ongoingMeeting = await getOngoingMeeting(session.userId);
      if (!ongoingMeeting) {
        return null;
      }
      return normalizeMeeting(ongoingMeeting, session.userId);
    },
  }),

  route<TNormalizedMeeting, [], { userId: string, placeId: string }>({
    method: 'post',
    path: '/meetings',
    restricted: true,
    validations: ({ session: { userId } }) => [
      body('userId')
        .isUUID(4).bail()
        .custom(isUserId({ blacklist: new Set([userId]) })),
      body('placeId')
        .isUUID(4).bail()
        .custom(isPlaceId()),
    ],
    callback: async ({ session, req: { body } }) => {
      const [
        sentInvitation, inviterOngoingMeeting,
        inviteeReceivedInvitation, inviteeOngoingMeeting,
        areUsersNearby_,
        isPlaceNearby_,
      ] = await Promise.all([
        getSentInvitation(session.userId), getOngoingMeeting(session.userId),
        getReceivedInvitation(body.userId), getOngoingMeeting(body.userId),
        areUsersNearby(body.userId, session.userId, usersConstants.searchRadius),
        isPlaceNearby(body.placeId, session.userId, placesConstants.searchRadius),
      ]);
      // todo: cannot invite the same person again if there was their meeting before
      if (sentInvitation) { // new person cannot be invited while the existing invitation is still valid.
        throw new ForbiddenError('There is already sent invitation.');
      }
      if (inviterOngoingMeeting) { // user cannot invite new person before finishing the existing meeting.
        throw new ForbiddenError('There is already ongoing date.');
      }
      if (inviteeReceivedInvitation || inviteeOngoingMeeting) { // it means someone other already invited this person, or they're in an ongoing meeting.
        throw new ForbiddenError('User cannot be invited now.');
      }
      if (!areUsersNearby_) { // check if invited user is still nearby
        throw new ForbiddenError('User is not nearby anymore.');
      }
      if (!isPlaceNearby_) { // check if chosen place is still nearby
        throw new ForbiddenError('Place is not nearby anymore.');
      }
      const expirationTime = add(new Date(), { seconds: meetingsConstants.invitationExpirationTime });
      const createdInvitation = await createInvitation(session.userId, body.userId, body.placeId, expirationTime);
      if (!createdInvitation.inviterUser || !createdInvitation.inviteeUser) {
        throw new InternalError('Meeting has missing data.');
      }
      emitInvitationReceivedSocketEvent(createdInvitation.inviteeUserId, createdInvitation.inviterUser.name);
      if (createdInvitation.inviteeUser.notificationsToken) {
        notifyAboutReceivedInvitation(createdInvitation.inviteeUser.notificationsToken, createdInvitation.inviterUser.name);
      }
      return normalizeMeeting(createdInvitation, session.userId);
    },
  }),

  route<TNormalizedMeeting, [], { accepted: boolean }>({
    method: 'put',
    path: '/meetings/received-invitation',
    restricted: true,
    validations: [
      body('accepted')
        .isBoolean(),
    ],
    callback: async ({ session, req: { body } }) => {
      const receivedInvitation = await getReceivedInvitation(session.userId);
      if (!receivedInvitation) {
        throw new NotFoundError('Received invitation does not exist.');
      }
      if (!receivedInvitation.place || !receivedInvitation.inviterUser || !receivedInvitation.inviteeUser) {
        throw new InternalError('Received invitation has missing data.');
      }
      let inviterPolyline: { latitude: string; longitude: string; }[] | null = null;
      let inviteePolyline: { latitude: string; longitude: string; }[] | null = null;
      if (body.accepted) {
        const placeCoordinate = { latitude: receivedInvitation.place.latitude, longitude: receivedInvitation.place.longitude };
        const inviterCoordinate = { latitude: receivedInvitation.inviterUser.latitude, longitude: receivedInvitation.inviterUser.longitude };
        const inviteeCoordinate = { latitude: receivedInvitation.inviteeUser.latitude, longitude: receivedInvitation.inviteeUser.longitude };
        [inviterPolyline, inviteePolyline] = await Promise.all([
          getPolyline(inviterCoordinate, placeCoordinate),
          getPolyline(inviteeCoordinate, placeCoordinate),
        ]);
      }
      const updatedMeeting = await updateMeeting(receivedInvitation.id, { ...body, inviterPolyline, inviteePolyline });
      if (!updatedMeeting.inviterUser || !updatedMeeting.inviteeUser) {
        throw new InternalError('Meeting has missing data.');
      }
      if (updatedMeeting.accepted) {
        emitInvitationAcceptedSocketEvent(updatedMeeting.inviterUserId, updatedMeeting.inviteeUser.name);
        if (updatedMeeting.inviterUser.notificationsToken) {
          notifyAboutAcceptedInvitation(updatedMeeting.inviterUser.notificationsToken, updatedMeeting.inviteeUser.name);
        }
      }
      return normalizeMeeting(updatedMeeting, session.userId);
    },
  }),

  route<null>({
    method: 'delete',
    path: '/meetings/ongoing',
    restricted: true,
    callback: async ({ session }) => {
      const ongoingMeeting = await getOngoingMeeting(session.userId);
      if (!ongoingMeeting) {
        throw new NotFoundError('Ongoing meeting does not exist.');
      }
      await updateMeeting(ongoingMeeting.id, { finished: true });
      emitOngoingMeetingFinishedSocketEvent(session.userId === ongoingMeeting.inviterUserId ? ongoingMeeting.inviteeUserId : ongoingMeeting.inviterUserId);
      return null;
    },
  }),
];

function normalizeMeeting(meeting: Meeting, userId: string): TNormalizedMeeting {
  const isInviterUser = userId === meeting.inviterUserId;
  const [companion, authedUser] = isInviterUser ? [meeting.inviteeUser, meeting.inviterUser] : [meeting.inviterUser, meeting.inviteeUser];
  if (!companion || !companion.photos || !authedUser || !meeting.place) {
    throw new InternalError('Meeting has missing data.');
  }
  return {
    id: meeting.id,
    user: {
      ...pick(companion, ['id', 'name', 'gender']),
      age: getAge(new Date(companion.dateOfBirth)),
      photos: (orderBy(companion.photos, ['isDefault', 'createdAt'], ['desc', 'asc']) || []).map((photo) => ({
        ...pick(photo, ['id', 'width', 'height', 'isDefault']),
        imageUrl: config.photo.image.url(photo.id),
        thumbnailUrl: config.photo.thumbnail.url(photo.id),
      })),
      compatibility: getCompatibility(companion, authedUser),
    },
    place: {
      ...pick(meeting.place, ['id', 'name', 'activity']),
      coordinate: {
        latitude: meeting.place.latitude,
        longitude: meeting.place.longitude,
      }
    },
    expirationTime: meeting.expirationTime.toISOString(),
    polyline: isInviterUser ? meeting.inviterPolyline : meeting.inviteePolyline,
  };
}
