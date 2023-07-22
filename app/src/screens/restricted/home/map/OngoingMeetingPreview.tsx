import { StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import { TMeeting } from '../../../../repos/meetings';
import MeetingPreview from '../../../../components/MeetingPreview';

type TInvitationPreviewProps = {
  ongoingMeeting: TMeeting;
  onPress: () => void;
};

export default function OngoingMeetingPreview({ ongoingMeeting, onPress }: TInvitationPreviewProps): JSX.Element {
  return (
    <MeetingPreview
      meeting={ongoingMeeting}
      iconName="heart"
      animatedIcon
      headerText={(
        <>
          You're dating <Text category="h6" status="danger" style={styles.headerText}>now</Text> with <Text category="h6">{ongoingMeeting.user.name}</Text>!
        </>
      )}
      footerText={(
        <>
          Walk there following the <Text category="s2" status="danger">red</Text> line on the map.
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
