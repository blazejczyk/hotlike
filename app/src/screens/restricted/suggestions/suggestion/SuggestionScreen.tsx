import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Icon, Button, Spinner } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack/src/types';

import ScreenContainer from '../../../../components/ScreenContainer';
import { TSuggestionsNavigator } from '../../../../services/navs';
import useUserLoader from '../../../../hooks/loaders/useUserLoader';
import usePlaceLoader from '../../../../hooks/loaders/usePlaceLoader';
import useSentInvitationLoader from '../../../../hooks/loaders/useSentInvitationLoader';
import useSaver from '../../../../hooks/useSaver';
import Loading from '../../../../components/Loading';
import LoadingError from '../../../../components/LoadingError';
import { sendInvitation } from '../../../../repos/meetings';
import Countdown from '../../../../components/Countdown';
import useDispatchContext from '../../../../hooks/contexts/useDispatchContext';
import UserHeader from '../../../../components/UserHeader';
import MeetingView from '../../../../components/MeetingView';
import useReceivedInvitationLoader from '../../../../hooks/loaders/useReceivedInvitationLoader';
import useOngoingMeetingLoader from '../../../../hooks/loaders/useOngoingMeetingLoader';
import { Gender } from '../../../../services/enums';

type TSuggestionScreenProps = StackScreenProps<TSuggestionsNavigator, 'suggestionScreen'>;

export default function SuggestionScreen({ navigation, route: { params: { userId, placeId } } }: TSuggestionScreenProps): JSX.Element {
  const { setSentInvitation, removeSuggestion } = useDispatchContext();

  const { loading: loadingUser, result: user, error: userLoadingError, load: reloadUser } = useUserLoader(userId);
  const { loading: loadingPlace, result: place, error: placeLoadingError, load: reloadPlace } = usePlaceLoader(placeId);
  const { result: sentInvitation } = useSentInvitationLoader();
  const { result: receivedInvitation } = useReceivedInvitationLoader();
  const { result: ongoingMeeting } = useOngoingMeetingLoader();

  const { loading: sendingInvitation, save: saveSendInvitation } = useSaver(async () => {
    const sentInvitation = await sendInvitation(userId, placeId);
    removeSuggestion({ userId, placeId });
    setSentInvitation(sentInvitation);
    navigation.goBack();
  });

  useEffect(() => {
    if (!sentInvitation) {
      return;
    }
    const delay = new Date(sentInvitation.expirationTime).getTime() - new Date().getTime();
    if (delay > 0) {
      const timeoutId = setTimeout(() => setSentInvitation(null), delay);
      return () => clearTimeout(timeoutId);
    } else {
      setSentInvitation(null);
    }
  }, [sentInvitation, setSentInvitation]);

  const handleErrorReload = useCallback(() => {
    if (userLoadingError) {
      reloadUser();
    }
    if (placeLoadingError) {
      reloadPlace();
    }
  }, [userLoadingError, placeLoadingError, reloadUser, reloadPlace]);

  const renderSendInvitationButtonIcon = useCallback(() => (
    sendingInvitation
      ? <Spinner size="tiny" />
      : <Icon name="heart-outline" fill="white" style={styles.sendInvitationButtonIcon} />
  ), [sendingInvitation]);

  return (
    <ScreenContainer>
      {((loadingUser && !user) || (loadingPlace && !place)) && <Loading />}
      {((userLoadingError && !user) || (placeLoadingError && !place)) && <LoadingError onReload={handleErrorReload} />}
      {user && place && (
        <>
          <UserHeader
            name={user.name}
            gender={user.gender}
            age={user.age}
            onBack={navigation.goBack}
            backIconName="list"
            divided
          />
          <MeetingView user={user} place={place}>
            <Button
              status="info"
              accessoryLeft={renderSendInvitationButtonIcon}
              onPress={sendingInvitation ? undefined : saveSendInvitation}
              disabled={sendingInvitation || Boolean(sentInvitation || receivedInvitation || ongoingMeeting)}
            >
              <Text>
                {sendingInvitation
                  ? 'ASKING...'
                  : (user.gender === Gender.MALE ? 'ASK HIM OUT!' : 'ASK HER OUT!')
                }
                {sentInvitation ? <> (<Countdown initialTime={sentInvitation.expirationTime} />)</> : ''}
              </Text>
            </Button>
          </MeetingView>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sendInvitationButtonIcon: {
    width: 18,
    height: 18,
  },
});
