import useLoader, { TLoader } from '../useLoader';
import { getToken } from '../../services/storage';

export default function useTokenLoader(): TLoader<string | null> {
  return useLoader<string | null>(
    'token',
    getToken,
    ({ token }) => token,
    ({ setToken }) => setToken,
  );
}
