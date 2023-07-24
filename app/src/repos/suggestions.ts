import { get } from '../core/api';
import { Activity, Gender } from '../services/enums';

export type TSuggestion = {
  user: {
    id: string;
    name: string;
    gender: Gender;
    age: number;
    compatibility: number;
    defaultPhoto: {
      thumbnailUrl: string;
    };
  };
  place: {
    id: string;
    name: string;
    activity: Activity;
    coordinate: {
      latitude: string;
      longitude: string;
    }
  };
};

export function getSuggestions(): Promise<TSuggestion[]> {
  return get<TSuggestion[]>('suggestions');
}
