import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import AppearanceCard from '../../../../components/settings/cards/AppearanceCard';
import AboutCard from '../../../../components/settings/cards/AboutCard';
import StatusCard from '../../../../components/settings/cards/StatusCard';
import PreferencesCard from '../../../../components/settings/cards/PreferencesCard';
import { TRegisteredAuthedUser } from '../../../../repos/auth';
import { TConstants } from '../../../../repos/constants';
import ContinueButton from '../ContinueButton';

type TIdentityStepProps = {
  registeredAuthedUser: TRegisteredAuthedUser;
  usersConstants: TConstants['users'];
  onChange: (data: Partial<TRegisteredAuthedUser>) => void;
  onComplete?: () => void;
};

export default function SettingsStep({ registeredAuthedUser, usersConstants, onChange, onComplete }: TIdentityStepProps): JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text category="h6" style={styles.headerInfo}>Please fill out information about yourself.</Text>
      <Text style={styles.headerDescription}>This will allow us to show you the best dating suggestions with like-minded people 💘.</Text>
      <View>
        <AppearanceCard
          user={registeredAuthedUser}
          minHeight={usersConstants.minHeight}
          maxHeight={usersConstants.maxHeight}
          onChange={onChange}
        />
        <AboutCard
          user={registeredAuthedUser}
          minActivitiesNumber={usersConstants.minActivitiesNumber}
          maxActivitiesNumber={usersConstants.maxActivitiesNumber}
          onChange={onChange}
        />
        <StatusCard
          user={registeredAuthedUser}
          onChange={onChange}
        />
        <PreferencesCard
          user={registeredAuthedUser}
          onChange={onChange}
        />
      </View>
      <ContinueButton onComplete={onComplete} style={styles.continueButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 12,
  },
  headerInfo: {
    marginBottom: 5,
    textAlign: 'center',
  },
  headerDescription: {
    marginBottom: 10,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 6,
  },
});
