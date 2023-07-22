import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Icon, Spinner, Tab, TabView, Text } from '@ui-kitten/components';
import { TextProps } from '@ui-kitten/components/ui/text/text.component';
import { last } from 'lodash';

import ScreenContainer from '../../../../components/ScreenContainer';
import { THomeNavigator, OngoingMeetingTabIndex } from '../../../../services/navs';
import useOngoingMeetingLoader from '../../../../hooks/loaders/useOngoingMeetingLoader';
import UserHeader from '../../../../components/UserHeader';
import MeetingView from '../../../../components/MeetingView';
import Loading from '../../../../components/Loading';
import LoadingError from '../../../../components/LoadingError';
import useSaver from '../../../../hooks/useSaver';
import { deleteOngoingMeeting } from '../../../../repos/meetings';
import { updateMessage } from '../../../../repos/messages';
import useDispatchContext from '../../../../hooks/contexts/useDispatchContext';
import MessagesTab from './messages/MessagesTab';
import useMessagesLoader from '../../../../hooks/loaders/useMessagesLoader';
import SvgIcon from '../../../../components/SvgIcon';
import useConfirm from '../../../../hooks/useConfirm';
import useSocketEvent from '../../../../hooks/useSocketEvent';
import { SocketEvent } from '../../../../core/io';
import useForeground from '../../../../hooks/useForeground';

type TOngoingScreenProps = StackScreenProps<THomeNavigator, 'ongoingMeetingScreen'>;

export default function OngoingMeetingScreen({ navigation, route: { params } }: TOngoingScreenProps): JSX.Element {
  const confirm = useConfirm();
  const { loading: loadingOngoingMeeting, result: ongoingMeeting, error: loadingOngoingMeetingError, load: reloadOngoingMeeting } = useOngoingMeetingLoader();
  const { loading: loadingMessages, result: messages, error: loadingMessagesError, load: reloadMessages } = useMessagesLoader();
  const { setOngoingMeeting, setMessages } = useDispatchContext();
  const [selectedTabIndex, setSelectedTabIndex] = useState(params.tab === null ? OngoingMeetingTabIndex.DETAILS : params.tab);
  const unreadMessages = useMemo(() => messages?.filter(({ type, read }) => type === 'received' && !read) || [], [messages]);

  const { loading: finishingMeeting, save: saveFinishMeeting } = useSaver(async () => {
    await deleteOngoingMeeting();
    setOngoingMeeting(null);
    navigation.goBack();
  });

  const { save: readMessages } = useSaver(async (messagesIds: string[]) => {
    await Promise.all(messagesIds.map((messageId) => updateMessage(messageId, { read: true })));
    if (messages) {
      const messagesIdsSet = new Set(messagesIds);
      setMessages(messages.map((message) => messagesIdsSet.has(message.id) ? { ...message, read: true } : message));
    }
  });

  const loadNewMessages = useCallback(() => {
    reloadMessages(last(messages)?.createdAt); // this will load only missing messages
  }, [messages, reloadMessages]);

  const renderMessagesTabTitle = useCallback((props: TextProps | undefined) => (
    <View style={styles.messagesTabTitleContainer}>
      <Text style={props?.style}>Messages</Text>
      {Boolean(unreadMessages.length) && selectedTabIndex !== OngoingMeetingTabIndex.MESSAGES && <SvgIcon scope="general" name="message" width="20" height="20" />}
    </View>
  ), [selectedTabIndex, unreadMessages.length]);

  const renderFinishMeetingButtonIcon = useCallback(() => (
    finishingMeeting
      ? <Spinner size="tiny" />
      : <Icon name="checkmark-circle-outline" fill="white" style={styles.finishMeetingButtonIcon} />
  ), [finishingMeeting]);

  const handleErrorReload = useCallback(() => {
    if (loadingOngoingMeetingError) {
      reloadOngoingMeeting();
    }
    if (loadingMessagesError) {
      reloadMessages();
    }
  }, [loadingOngoingMeetingError, loadingMessagesError, reloadOngoingMeeting, reloadMessages]);

  const handleFinishMeeting = useCallback(() => {
    confirm('Are you sure you want to finish the meeting?', saveFinishMeeting);
  }, [confirm, saveFinishMeeting]);

  const handleSelectTab = useCallback((tabIndex: number) => {
    setSelectedTabIndex(tabIndex);
    // if (unreadMessages.length && tabIndex === 1) {
    //   readMessages(unreadMessages.map(({ id }) => id));
    // }
  }, []);

  useEffect(() => {
    if (unreadMessages.length && selectedTabIndex === OngoingMeetingTabIndex.MESSAGES) {
      readMessages(unreadMessages.map(({ id }) => id));
    }
  }, [readMessages, selectedTabIndex, unreadMessages]);

  const handleFocusEffect = useCallback(() => {
    if (params.tab !== null) {
      setSelectedTabIndex(params.tab);
      navigation.setParams({ tab: null });
    }
  }, [navigation, params.tab]);

  useFocusEffect(handleFocusEffect);

  useForeground(reloadMessages);

  useSocketEvent(SocketEvent.INVITATION_ACCEPTED, reloadMessages);
  useSocketEvent(SocketEvent.ONGOING_MEETING_FINISHED, navigation.goBack);
  useSocketEvent(SocketEvent.MESSAGE_RECEIVED, loadNewMessages);

  const tabs = useMemo<JSX.Element[]>(() => {
    if (!ongoingMeeting || !messages) {
      return [];
    }
    const arr = [];
    arr[OngoingMeetingTabIndex.DETAILS] = (
      <Tab key={OngoingMeetingTabIndex.DETAILS} title="Details">
        <MeetingView user={ongoingMeeting.user} place={ongoingMeeting.place}>
          <Button
            status="info"
            accessoryLeft={renderFinishMeetingButtonIcon}
            onPress={finishingMeeting ? undefined : handleFinishMeeting}
            disabled={finishingMeeting}
          >
            <Text>
              {finishingMeeting
                ? 'FINISHING...'
                : 'FINISH MEETING'
              }
            </Text>
          </Button>
        </MeetingView>
      </Tab>
    );
    arr[OngoingMeetingTabIndex.MESSAGES] = (
      <Tab key={OngoingMeetingTabIndex.MESSAGES} title={renderMessagesTabTitle}>
        <MessagesTab messages={messages} onSentMessage={loadNewMessages} />
      </Tab>
    );
    return arr;
  }, [ongoingMeeting, messages, finishingMeeting, handleFinishMeeting, loadNewMessages, renderFinishMeetingButtonIcon, renderMessagesTabTitle]);

  return (
    <ScreenContainer>
      {((loadingOngoingMeeting && !ongoingMeeting) || (loadingMessages && !messages)) && <Loading />}
      {((loadingOngoingMeetingError && !ongoingMeeting) || (loadingMessagesError && !messages)) && <LoadingError onReload={handleErrorReload} />}
      {ongoingMeeting && messages && (
        <>
          <UserHeader
            name={ongoingMeeting.user.name}
            gender={ongoingMeeting.user.gender}
            age={ongoingMeeting.user.age}
            onBack={navigation.goBack}
            backIconName="map-outline"
          />
          <TabView
            selectedIndex={selectedTabIndex}
            onSelect={handleSelectTab}
            swipeEnabled={false}
            style={styles.tabView}
          >
            {tabs}
          </TabView>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
  finishMeetingButtonIcon: {
    width: 18,
    height: 18,
  },
  messagesTabTitleContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
});
