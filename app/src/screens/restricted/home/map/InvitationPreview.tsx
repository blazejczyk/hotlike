import { StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import { TMeeting } from '../../../../repos/meetings';
import { useEffect } from 'react';
import Countdown from '../../../../components/Countdown';
import useDispatchContext from '../../../../hooks/contexts/useDispatchContext';
import MeetingPreview from '../../../../components/MeetingPreview';

type TInvitationPreviewProps = {
  invitation: TMeeting;
  onPress: () => void;
};

export default function InvitationPreview({ invitation, onPress }: TInvitationPreviewProps): JSX.Element {
  const { setReceivedInvitation } = useDispatchContext();

  useEffect(() => {
    const delay = new Date(invitation.expirationTime).getTime() - new Date().getTime();
    if (delay > 0) {
      const timeoutId = setTimeout(() => setReceivedInvitation(null), delay);
      return () => clearTimeout(timeoutId);
    } else {
      setReceivedInvitation(null);
    }
  }, [invitation.expirationTime, setReceivedInvitation]);

  return (
    <MeetingPreview
      meeting={invitation}
      iconName="heart-outline"
      headerText={(
        <>
          <Text category="h6">{invitation.user.name}</Text> is <Text category="h6" status="danger" style={styles.headerText}>asking</Text> you out!
        </>
      )}
      footerText={(
        <>
          Make your decision within <Text category="s2" status="danger"><Countdown initialTime={invitation.expirationTime} /></Text> seconds.
        </>
      )}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'normal',
  },
});
