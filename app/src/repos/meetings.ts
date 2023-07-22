import { get, post, put, delete_ } from '../core/api';
import { Activity, Gender } from './auth';
import { TPhoto } from './photos';

export type TMeeting = {
  id: string;
  user: {
    id: string;
    name: string;
    gender: Gender;
    age: number;
    compatibility: number;
    photos: TPhoto[];
  };
  place: {
    id: string;
    name: string;
    activity: Activity;
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

export function getReceivedInvitation(): Promise<TMeeting | null> {
  return get<TMeeting | null>('meetings/received-invitation');
}

export function getSentInvitation(): Promise<TMeeting | null> {
  return get<TMeeting | null>('meetings/sent-invitation');
}

export function getOngoingMeeting(): Promise<TMeeting | null> {
  return get<TMeeting | null>('meetings/ongoing');
}

export function sendInvitation(userId: string, placeId: string): Promise<TMeeting> {
  return post<TMeeting>('meetings', { userId, placeId });
}

export function updateReceivedInvitation(data: { accepted: boolean; }): Promise<TMeeting> {
  return put<TMeeting>('meetings/received-invitation', data);
}

export function deleteOngoingMeeting(): Promise<null> {
  return delete_<null>('meetings/ongoing');
}
