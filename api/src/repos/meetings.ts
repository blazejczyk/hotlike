import { Op } from 'sequelize';

import { Meeting, Place, User, Photo } from '../db/schemas/models';

const include = [
  {
    model: User,
    as: 'inviterUser',
    include: [Photo],
  },
  {
    model: User,
    as: 'inviteeUser',
    include: [Photo],
  },
  Place,
];

export function getSentInvitation(userId: string): Promise<Meeting | null> {
  return Meeting.findOne({
    where: {
      inviterUserId: userId,
      expirationTime: {
        [Op.gt]: new Date(),
      },
      accepted: null,
    },
    include,
  });
}

export function getReceivedInvitation(userId: string): Promise<Meeting | null> {
  return Meeting.findOne({
    where: {
      inviteeUserId: userId,
      expirationTime: {
        [Op.gt]: new Date(),
      },
      accepted: null,
    },
    include,
  });
}

export function getOngoingMeeting(userId: string): Promise<Meeting | null> {
  return Meeting.findOne({
    where: {
      [Op.or]: [{ inviterUserId: userId }, { inviteeUserId: userId }],
      accepted: true,
      finished: false,
    },
    include,
  });
}

export async function createInvitation(inviterUserId: string, inviteeUserId: string, placeId: string, expirationTime: Date): Promise<Meeting> {
  const invitation = await Meeting.create({ inviterUserId, inviteeUserId, placeId, expirationTime }, { include });
  await invitation.reload();
  return invitation;
}

export async function updateMeeting(meetingId: string, data: Partial<Pick<Meeting, 'accepted' | 'finished' | 'inviterPolyline' | 'inviteePolyline'>>): Promise<Meeting> {
  const meeting = await Meeting.findByPk(meetingId, { include });
  if (!meeting) {
    throw new Error('Meeting does not exist.');
  }
  await meeting.update(data);
  return meeting;
}
