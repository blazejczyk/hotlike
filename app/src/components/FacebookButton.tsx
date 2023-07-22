import { useCallback } from 'react';

import { StyleSheet } from 'react-native';
import { Button, Icon, useTheme } from '@ui-kitten/components';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type TFacebookButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function FacebookButton({ text, disabled, onPress, style }: TFacebookButtonProps): JSX.Element {
  const theme = useTheme();

  const renderFacebookIcon = useCallback(() => (
    <Icon name="facebook-outline" fill={theme['color-info-default']} style={styles.facebookIcon} />
  ), [theme]);

  return (
    <Button
      status="info"
      appearance="outline"
      accessoryLeft={renderFacebookIcon}
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      {text}
    </Button>
  );
}

const styles = StyleSheet.create({
  facebookIcon: {
    width: 22,
    height: 22,
  },
});
