import { get } from '../core/api';
import { Activity } from '../services/enums';

export type TPlace = {
  id: string;
  name: string;
  activity: Activity;
  coordinate: {
    latitude: string;
    longitude: string;
  }
};

export function getPlace(placeId: string): Promise<TPlace> {
  return get<TPlace>(`places/${placeId}`);
}
