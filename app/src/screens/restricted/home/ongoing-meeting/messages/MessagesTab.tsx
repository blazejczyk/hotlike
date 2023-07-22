import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Input, Icon, useTheme, Spinner, Text } from '@ui-kitten/components';

import Message from './Message';
import useSaver from '../../../../../hooks/useSaver';
import { createMessage, TMessage } from '../../../../../repos/messages';

type TMessagesTabProps = {
  messages: TMessage[];
  onSentMessage: () => void;
};

export default function MessagesTab({ messages, onSentMessage }: TMessagesTabProps): JSX.Element {
  const theme = useTheme();
  const [inputMessage, setInputMessage] = useState<string>('');
  const messagesViewRef = useRef<ScrollView | null>(null);
  const messageInputRef = useRef<Input | null>(null);

  const { loading: sendingMessage, save: saveSendMessage } = useSaver(async () => {
    await createMessage(inputMessage);
    messageInputRef.current?.blur();
    setInputMessage('');
    onSentMessage();
  });

  const renderSendMessageIcon = useCallback(() => (
    sendingMessage
      ? <Spinner size="tiny" />
      : (
        <TouchableWithoutFeedback onPress={saveSendMessage}>
          <Icon name="paper-plane" fill={theme['color-basic-600']} style={styles.sendMessageIcon} />
        </TouchableWithoutFeedback>
      )
  ), [saveSendMessage, sendingMessage, theme]);

  const handleMessagesViewContentSizeChange = useCallback(() => {
    if (messagesViewRef.current) {
      messagesViewRef.current.scrollToEnd({ animated: false });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView ref={messagesViewRef} style={styles.messages} onContentSizeChange={handleMessagesViewContentSizeChange}>
        {messages.length
          ? messages.map((message) => <Message key={message.id} message={message} />)
          : (
            <View style={styles.noMessages}>
              <Text style={styles.noMessagesText}>There are no messages yet.</Text>
              <Text style={styles.noMessagesText}>Chat is good if you can't find each other 🤷</Text>
              <Text style={styles.noMessagesText}>But... try not to use it, just go and meet! 😁</Text>
            </View>
          )
        }
      </ScrollView>
      <View style={styles.messageForm}>
        <Input
          multiline
          ref={messageInputRef}
          placeholder="Message..."
          value={inputMessage}
          onChangeText={setInputMessage}
          accessoryRight={renderSendMessageIcon}
          style={styles.sendMessageInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messages: {
    flex: 1,
  },
  messageForm: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
  },
  sendMessageInput: {
    flex: 1,
  },
  sendMessageIcon: {
    width: 20,
    height: 20,
  },
  noMessages: {
    margin: 15,
    gap: 10,
    alignItems: 'center',
  },
  noMessagesText: {
    textAlign: 'center',
  },
});
