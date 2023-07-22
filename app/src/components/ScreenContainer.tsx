import { PropsWithChildren, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type TScreenContainerProps = {
  style?: StyleProp<ViewStyle>;
};

export default function ScreenContainer({ style, children }: PropsWithChildren<TScreenContainerProps>): JSX.Element {
  const containerStyle = useMemo(() => [styles.container, style], [style]);

  return (
    <SafeAreaView style={containerStyle}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
