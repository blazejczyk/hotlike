import { get } from '../core/api';

export type TPrediction = {
  id: string;
  compatibility: number;
  coordinate: {
    latitude: string;
    longitude: string;
  }
};

export function getPredictions(): Promise<TPrediction[]> {
  return get<TPrediction[]>('predictions');
}
