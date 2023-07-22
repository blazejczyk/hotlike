import { StyleSheet } from 'react-native';
import { Button, Icon, Spinner } from '@ui-kitten/components';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type TContinueButtonProps = {
  text?: string;
  onComplete?: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function ContinueButton({ text, onComplete, loading, style }: TContinueButtonProps): JSX.Element {
  return (
    <Button
      status="info"
      appearance={loading ? 'outline' : 'filled'}
      accessoryLeft={loading ? renderSpinner : renderContinueIcon}
      onPress={onComplete}
      disabled={!onComplete || loading}
      style={style}
    >
      {text || 'CONTINUE'}
    </Button>
  );
}

function renderSpinner() {
  return <Spinner size="tiny" />;
}

function renderContinueIcon() {
  return <Icon name="checkmark-outline" fill="white" style={styles.continueIcon} />;
}

const styles = StyleSheet.create({
  continueIcon: {
    width: 22,
    height: 22,
  },
});
