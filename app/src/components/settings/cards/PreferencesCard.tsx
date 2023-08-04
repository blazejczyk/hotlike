import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox, Toggle, Text, Avatar } from '@ui-kitten/components';

import { TAuthedUser, TAuthedUserUpdatableFields } from '../../../repos/auth';
import SettingsCard from '../SettingsCard';
import { Gender } from '../../../services/enums';

type TPreferencesProps = {
  user: Pick<TAuthedUser, 'preferredGenders' | 'prefersTaller' | 'prefersShorter' | 'rejectsSmoking' | 'rejectsKids'>;
  onChange: (data: Partial<Pick<TAuthedUser, TAuthedUserUpdatableFields>>) => void;
};

export default function PreferencesCard({ user, onChange }: TPreferencesProps) {
  const updatePreferredGenders = useCallback((prefers: boolean, gender: Gender) => {
    if (prefers && !user.preferredGenders.includes(gender)) {
      onChange({ preferredGenders: [...user.preferredGenders, gender] });
    } else if (!prefers && user.preferredGenders.includes(gender)) {
      onChange({ preferredGenders: user.preferredGenders.filter((preferredGender) => preferredGender !== gender) });
    }
  }, [onChange, user.preferredGenders]);

  const handleUpdatePrefersMale = useCallback((prefersMale: boolean) => {
    updatePreferredGenders(prefersMale, Gender.MALE);
  }, [updatePreferredGenders]);

  const handleUpdatePrefersFemale = useCallback((prefersFemale: boolean) => {
    updatePreferredGenders(prefersFemale, Gender.FEMALE);
  }, [updatePreferredGenders]);

  const handleUpdatePrefersTaller = useCallback((prefersTaller: boolean) => {
    onChange({ prefersTaller });
  }, [onChange]);

  const handleUpdatePrefersShorter = useCallback((prefersShorter: boolean) => {
    onChange({ prefersShorter });
  }, [onChange]);

  const handleUpdateRejectsSmoking = useCallback((rejectsSmoking: boolean) => {
    onChange({ rejectsSmoking });
  }, [onChange]);

  const handleUpdateRejectsKids = useCallback((rejectsKids: boolean) => {
    onChange({ rejectsKids });
  }, [onChange]);

  return (
    <SettingsCard header="Preferences">
      <Text category="c2" appearance="hint" style={styles.interestsTitle}>Interested in</Text>
      <View style={styles.checkboxes}>
        <CheckBox
          checked={user.preferredGenders.includes(Gender.MALE)}
          onChange={handleUpdatePrefersMale}
        >
          male
        </CheckBox>
        <CheckBox
          checked={user.preferredGenders.includes(Gender.FEMALE)}
          onChange={handleUpdatePrefersFemale}
        >
          female
        </CheckBox>
      </View>
      <View style={styles.checkboxes}>
        <CheckBox
          checked={user.prefersTaller}
          onChange={handleUpdatePrefersTaller}
        >
          taller than me
        </CheckBox>
        <CheckBox
          checked={user.prefersShorter}
          onChange={handleUpdatePrefersShorter}
        >
          shorter than me
        </CheckBox>
      </View>
      <View style={styles.toggleContainer}>
        <Toggle
          checked={user.rejectsSmoking}
          onChange={handleUpdateRejectsSmoking}
          style={styles.rejectsSmokingToggle}
        >
          {(props) => (
            <View {...props} style={[props?.style, styles.toggleContent]}>
              <Avatar source={require('../../../../assets/images/no-smokers.png')} size="small" />
              <Text category="s2">No smokers</Text>
            </View>
          )}
        </Toggle>
      </View>
      <View style={styles.toggleContainer}>
        <Toggle
          checked={user.rejectsKids}
          onChange={handleUpdateRejectsKids}
          style={styles.rejectsKidsToggle}
        >
          {(props) => (
            <View {...props} style={[props?.style, styles.toggleContent]}>
              <Avatar source={require('../../../../assets/images/no-parents.png')} size="small" />
              <Text category="s2">No parents</Text>
            </View>
          )}
        </Toggle>
      </View>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  interestsTitle: {
    fontWeight: 'bold',
  },
  checkboxes: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rejectsSmokingToggle: {
    marginTop: 7,
    marginBottom: 5,
  },
  rejectsKidsToggle: {
    marginTop: 5,
  },
});
