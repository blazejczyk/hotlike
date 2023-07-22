import useLoader, { TLoader } from '../useLoader';
import { getOngoingMeeting, TMeeting } from '../../repos/meetings';

export default function useOngoingMeetingLoader(): TLoader<TMeeting | null> {
  return useLoader<TMeeting | null>(
    'ongoingMeeting',
    getOngoingMeeting,
    ({ ongoingMeeting }) => ongoingMeeting,
    ({ setOngoingMeeting }) => setOngoingMeeting,
  );
}
