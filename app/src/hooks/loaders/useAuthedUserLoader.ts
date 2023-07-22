import useLoader, { TLoader } from '../useLoader';
import { getAuthedUser, TAuthedUser } from '../../repos/auth';

export default function useAuthedUserLoader(): TLoader<TAuthedUser> {
  return useLoader<TAuthedUser>(
    'authedUser',
    getAuthedUser,
    ({ authedUser }) => authedUser,
    ({ setAuthedUser }) => setAuthedUser,
  );
}
