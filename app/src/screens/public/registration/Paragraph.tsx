import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { isString } from 'lodash';

type TParagraphProps = {
  header?: string;
};

export default function Paragraph({ header, children }: PropsWithChildren<TParagraphProps>): JSX.Element {
  return (
    <View style={styles.container}>
      {header && <Text style={styles.header}>{header}</Text>}
      {isString(children) ? <Text>{children}</Text> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
});
