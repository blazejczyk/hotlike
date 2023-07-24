import { get, post, put, delete_ } from '../core/api';
import { TPhoto } from './photos';
import { Activity, Body, Gender, Goal, Personality } from '../services/enums';

export type TAuthedUser = {
  id: string;
  email: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  height: number;
  body: Body;
  smoking: boolean;
  activities: Activity[];
  personality: Personality;
  goals: Goal[];
  hasKids: boolean;
  preferredGenders: Gender[];
  prefersTaller: boolean;
  prefersShorter: boolean;
  rejectsSmoking: boolean;
  rejectsKids: boolean;
  latitude: string;
  longitude: string;
  disabled: boolean;
  photos: TPhoto[];
};

export type TRegisteredAuthedUser = Pick<
  TAuthedUser,
  'name' | 'gender' | 'dateOfBirth' | 'height' | 'body' | 'smoking' | 'activities' | 'personality' | 'goals' | 'hasKids' |
  'preferredGenders' | 'prefersTaller' | 'prefersShorter' | 'rejectsSmoking' | 'rejectsKids' | 'latitude' | 'longitude'
> & {
  photoFile: string;
  email: string;
  password?: string;
  fbToken?: string;
};

export type TAuthedUserUpdatableFields = 'email' | 'height' | 'body' | 'smoking' | 'activities' | 'personality' | 'goals' | 'hasKids' | 'preferredGenders' | 'prefersTaller' | 'prefersShorter' | 'rejectsSmoking' | 'rejectsKids' | 'latitude' | 'longitude' | 'disabled';

export function getAuthedUser(): Promise<TAuthedUser> {
  return get<TAuthedUser>('auth/user');
}

export function updateAuthedUser(data: Partial<Pick<TAuthedUser, TAuthedUserUpdatableFields>>): Promise<TAuthedUser> {
  return put<TAuthedUser>('auth/user', data);
}

export function createAuthedUser(
  name: string, gender: Gender, dateOfBirth: string, height: number, body: Body, smoking: boolean, activities: Activity[],
  personality: Personality, goals: Goal[], hasKids: boolean, preferredGenders: Gender[], prefersTaller: boolean,
  prefersShorter: boolean, rejectsSmoking: boolean, rejectsKids: boolean, latitude: string, longitude: string,
  photoFile: string, email?: string, password?: string, fbToken?: string,
): Promise<TAuthedUser> {
  return post<TAuthedUser>('auth/user', {
    name, gender, dateOfBirth, height, body, smoking, activities, personality, goals, hasKids, preferredGenders,
    prefersTaller, prefersShorter, rejectsSmoking, rejectsKids, latitude, longitude, photoFile, email, password, fbToken,
  }, {}, true);
}

export function deleteAuthedUser(): Promise<null> {
  return delete_<null>('auth/user');
}

export function login(email: string, password: string, notificationsToken: string): Promise<{ token: string; }> {
  return post<{ token: string; }>('auth/login', { email, password, notificationsToken }, {}, true);
}

export function logout(): Promise<void> {
  return post<void>('auth/logout');
}

export function reset(email: string): Promise<void> {
  return post<void>('auth/reset', { email }, {}, true);
}

export function activate(email: string, code: string, password?: string): Promise<void> {
  return post<void>('auth/activation', { email, code, password }, {}, true);
}
