import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

type TCaseProps = {
  title?: string;
  children?: string;
  hideBullet?: boolean;
};

export default function Case({ title, children, hideBullet }: TCaseProps): JSX.Element {
  return (
    <View style={styles.container}>
      {title && <Text>{hideBullet ? '' : '- '}{title}</Text>}
      {children && <Text>{children}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
});
