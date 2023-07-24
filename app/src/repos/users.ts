import { get } from '../core/api';
import { TPhoto } from './photos';
import { Gender } from '../services/enums';

export type TUser = {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  compatibility: number;
  photos: TPhoto[];
};

export function getUser(userId: string): Promise<TUser> {
  return get<TUser>(`users/${userId}`);
}
