import useLoader, { TLoader } from '../useLoader';
import { getSentInvitation, TMeeting } from '../../repos/meetings';

export default function useSentInvitationLoader(): TLoader<TMeeting | null> {
  return useLoader<TMeeting | null>(
    'sentInvitation',
    getSentInvitation,
    ({ sentInvitation }) => sentInvitation,
    ({ setSentInvitation }) => setSentInvitation,
  );
}
