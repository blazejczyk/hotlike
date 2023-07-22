import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from '@ui-kitten/components';

import { Goal, TAuthedUser, TAuthedUserUpdatableFields } from '../../../repos/auth';
import SettingsCard from '../SettingsCard';
import SettingsDropdown, { TSettingsDropdownOption } from '../SettingsDropdown';

type TStatusProps = {
  user: Pick<TAuthedUser, 'goals' | 'hasKids'>;
  onChange: (data: Partial<Pick<TAuthedUser, TAuthedUserUpdatableFields>>) => void;
};

const goalsOptions: TSettingsDropdownOption<Goal>[] = [
  {
    value: Goal.SERIOUS_RELATIONSHIP,
    text: 'Serious relationship',
  },
  {
    value: Goal.CASUAL_RELATIONSHIP,
    text: 'Casual relationship',
  },
  {
    value: Goal.OPEN_RELATIONSHIP,
    text: 'Open relationship',
  },
  {
    value: Goal.FRIENDSHIP,
    text: 'Friendship',
  },
  {
    value: Goal.ACQUAINTANCESHIP,
    text: 'Acquaintanceship',
  },
];

export default function StatusCard({ user, onChange }: TStatusProps) {
  const handleUpdateGoals = useCallback((goals: Goal[]) => {
    onChange({ goals });
  }, [onChange]);

  const handleUpdateHasKids = useCallback((hasKids: boolean) => {
    onChange({ hasKids })
  }, [onChange]);

  return (
    <SettingsCard header="Status">
      <SettingsDropdown<Goal>
        multiple
        options={goalsOptions}
        value={user.goals}
        label="Looking for"
        onChange={handleUpdateGoals}
      />
      <View style={styles.hasKidsCheckboxContainer}>
        <CheckBox
          checked={user.hasKids}
          onChange={handleUpdateHasKids}
        >
          I have kids
        </CheckBox>
      </View>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  hasKidsCheckboxContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});
