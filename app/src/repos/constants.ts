import { get } from '../core/api';

export type TConstants = {
  users: {
    searchRadius: number;
    searchLimit: number;
    minHeight: number;
    maxHeight: number;
    minActivitiesNumber: number,
    maxActivitiesNumber: number,
    minPasswordLength: number;
    maxPasswordLength: number;
    resetPasswordTime: number;
  };
  meetings: {
    invitationExpirationTime: number;
  };
  places: {
    searchRadius: number;
    searchLimit: number;
  };
  photos: {
    minPhotosNumber: number;
    maxPhotosNumber: number;
    maxFileSize: number;
    image: {
      dimension: {
        width: number;
        height: number;
      };
    };
    thumbnail: {
      dimension: {
        width: number;
        height: number;
      };
    };
  };
  messages: {
    minTextLength: number;
    maxTextLength: number;
  };
};

export function getConstants(): Promise<TConstants> {
  return get<TConstants>('constants', {}, true);
}
