import useLoader, { TLoader } from '../useLoader';
import { getReceivedInvitation, TMeeting } from '../../repos/meetings';

export default function useReceivedInvitationLoader(): TLoader<TMeeting | null> {
  return useLoader<TMeeting | null>(
    'receivedInvitation',
    getReceivedInvitation,
    ({ receivedInvitation }) => receivedInvitation,
    ({ setReceivedInvitation }) => setReceivedInvitation,
  );
}
