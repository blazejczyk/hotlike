import useLoader, { TLoader } from '../useLoader';
import { getConstants, TConstants } from '../../repos/constants';

export default function useConstantsLoader(): TLoader<TConstants> {
  return useLoader<TConstants>(
    'constants',
    getConstants,
    ({ constants }) => constants,
    ({ setConstants }) => setConstants,
  );
}
