import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';

import { TMessage } from '../../../../../repos/messages';
import TimeDistance from '../../../../../components/TimeDistance';

type TMessageProps = {
  message: TMessage;
};

export default function Message({ message }: TMessageProps): JSX.Element {
  const theme = useTheme();
  const isReceived = message.type === 'received';

  const containerStyle = useMemo(() => [
    styles.container,
    isReceived
      ? styles.receivedContainer
      : styles.sentContainer
  ], [isReceived]);

  const indicatorStyle = useMemo(() => [
    styles.indicator,
    isReceived
      ? { borderRightWidth: 6, borderRightColor: theme['color-basic-600'] }
      : { borderLeftWidth: 6, borderLeftColor: theme['color-primary-default'] },
  ], [isReceived, theme]);

  const messageTextStyle = useMemo(() => [
    styles.text,
    isReceived
      ? { marginRight: 10, backgroundColor: theme['color-basic-600'] }
      : { marginLeft: 10, backgroundColor: theme['color-primary-default'] },
  ], [isReceived, theme]);

  return (
    <View style={containerStyle}>
      <View style={indicatorStyle}/>
      <Text style={messageTextStyle}>
        {message.text}
      </Text>
      <Text appearance="hint" category="c2" style={styles.date}>
        <TimeDistance time={message.createdAt} />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginHorizontal: 8,
  },
  receivedContainer: {
    flexDirection: 'row'
  },
  sentContainer: {
    flexDirection: 'row-reverse'
  },
  indicator: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
    alignSelf: 'center'
  },
  text: {
    color: 'white',
    padding: 20,
    borderRadius: 6,
    flexShrink: 1
  },
  date: {
    alignSelf: 'center'
  },
});
