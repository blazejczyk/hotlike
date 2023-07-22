import useLoader, { TLoader } from '../useLoader';
import { getPredictions, TPrediction } from '../../repos/predictions';

export default function usePredictionsLoader(): TLoader<TPrediction[]> {
  return useLoader<TPrediction[]>(
    'predictions',
    getPredictions,
    ({ predictions }) => predictions,
    ({ setPredictions }) => setPredictions,
  );
}
