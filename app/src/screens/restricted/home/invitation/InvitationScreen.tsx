import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon, Spinner, Text } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack/src/types';

import ScreenContainer from '../../../../components/ScreenContainer';
import { THomeNavigator } from '../../../../services/navs';
import useReceivedInvitationLoader from '../../../../hooks/loaders/useReceivedInvitationLoader';
import Loading from '../../../../components/Loading';
import LoadingError from '../../../../components/LoadingError';
import MeetingView from '../../../../components/MeetingView';
import Countdown from '../../../../components/Countdown';
import useSaver from '../../../../hooks/useSaver';
import { updateReceivedInvitation } from '../../../../repos/meetings';
import useDispatchContext from '../../../../hooks/contexts/useDispatchContext';
import UserHeader from '../../../../components/UserHeader';

type TInvitationScreenProps = StackScreenProps<THomeNavigator, 'invitationScreen'>;

export default function InvitationScreen({ navigation }: TInvitationScreenProps): JSX.Element {
  const { loading: loadingReceivedInvitation, result: receivedInvitation, error: loadingReceivedInvitationError, load: reloadReceivedInvitation } = useReceivedInvitationLoader();
  const { setReceivedInvitation, setOngoingMeeting } = useDispatchContext();

  const { loading: savingReceivedInvitation, save: setReceivedInvitationAcceptance } = useSaver(async (accepted: boolean) => {
    const updatedReceivedInvitation = await updateReceivedInvitation({ accepted });
    setReceivedInvitation(null);
    if (accepted) {
      setOngoingMeeting(updatedReceivedInvitation);
    }
    navigation.goBack();
  });

  const renderAcceptButtonIcon = useCallback(() => (
    savingReceivedInvitation
      ? <Spinner size="tiny" />
      : <Icon name="checkmark-circle-outline" fill="white" style={styles.buttonIcon} />
  ), [savingReceivedInvitation]);

  const renderRejectButtonIcon = useCallback(() => <Icon name="slash-outline" fill="white" style={styles.buttonIcon} />, []);

  const handleAccept = useCallback(() => {
    setReceivedInvitationAcceptance(true);
  }, [setReceivedInvitationAcceptance]);

  const handleReject = useCallback(() => {
    setReceivedInvitationAcceptance(false);
  }, [setReceivedInvitationAcceptance]);

  return (
    <ScreenContainer>
      {loadingReceivedInvitation && !receivedInvitation && <Loading />}
      {loadingReceivedInvitationError && !receivedInvitation && <LoadingError onReload={reloadReceivedInvitation} />}
      {receivedInvitation && (
        <>
          <UserHeader
            name={receivedInvitation.user.name}
            gender={receivedInvitation.user.gender}
            age={receivedInvitation.user.age}
            onBack={navigation.goBack}
            backIconName="map-outline"
            divided
          />
          <MeetingView user={receivedInvitation.user} place={receivedInvitation.place} contentStyle={styles.buttons}>
            <Button
              status="success"
              style={styles.button}
              accessoryLeft={renderAcceptButtonIcon}
              onPress={handleAccept}
            >
              YES!
            </Button>
            <Button
              status="danger"
              style={styles.button}
              accessoryLeft={renderRejectButtonIcon}
              onPress={handleReject}
            >
              <Text>NO (<Countdown initialTime={receivedInvitation.expirationTime} />)</Text>
            </Button>
          </MeetingView>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    width: 130,
  },
  buttonIcon: {
    width: 18,
    height: 18,
  },
});
