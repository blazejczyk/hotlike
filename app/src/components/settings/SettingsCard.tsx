import { PropsWithChildren, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from '@ui-kitten/components';

type TSettingsCardProps = {
  header: string;
};

export default function SettingsCard({ header, children }: PropsWithChildren<TSettingsCardProps>) {
  const renderHeader = useCallback(() => <Text style={styles.header}>{header}</Text>, [header]);

  return (
    <Card
      header={renderHeader}
      style={styles.settingsCard}
    >
      <View style={styles.body}>
        {children}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  settingsCard: {
    marginVertical: 6,
  },
  header: {
    padding: 15,
    fontWeight: 'bold',
  },
  body: {
    padding: 15,
  },
});
