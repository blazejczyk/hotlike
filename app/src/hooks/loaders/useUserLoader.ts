import useLoader, { TLoader } from '../useLoader';
import { getUser, TUser } from '../../repos/users';

export default function useUserLoader(userId: string): TLoader<TUser> {
  return useLoader<TUser>(
    `user_${userId}`,
    () => getUser(userId),
    ({ usersById }) => usersById.get(userId) || null,
    ({ setUser }) => setUser,
  );
}
