import { View, StyleSheet } from 'react-native';
import { Spinner } from '@ui-kitten/components';

export default function Loading(): JSX.Element {
  return (
    <View style={styles.container}>
      <Spinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
