import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Icon, Text, useTheme } from '@ui-kitten/components';
import { TextElement } from '@ui-kitten/components/ui/text/text.component';

type TLoadingErrorProps = {
  onReload: () => void;
  headErrorMessage?: TextElement | string;
  detailedErrorMessage?: TextElement | string;
};

export default function LoadingError({ onReload, headErrorMessage, detailedErrorMessage }: TLoadingErrorProps): JSX.Element {
  const theme = useTheme();

  const renderAccessoryLeft = useCallback(() => (
    <Icon name="refresh-outline" fill={theme['color-basic-700']} style={styles.buttonIcon} />
  ), [theme]);

  return (
    <View style={styles.container}>
      <Card status="danger">
        <View style={styles.content}>
          <Text style={styles.header}>{headErrorMessage || 'Oops, some data loading failed 😩'}</Text>
          <Text style={styles.details}>{detailedErrorMessage || 'Please check your connection and try again.'}</Text>
          <Button
            status="basic"
            accessoryLeft={renderAccessoryLeft}
            onPress={onReload}
            style={[styles.button]}
          >
            REFRESH
          </Button>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 15,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  details: {
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
  },
  buttonIcon: {
    width: 18,
    height: 18,
  }
});
