import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { range } from 'lodash';
import { CheckBox } from '@ui-kitten/components';

import { TAuthedUser, TAuthedUserUpdatableFields } from '../../../repos/auth';
import SettingsCard from '../SettingsCard';
import SettingsDropdown, { TSettingsDropdownOption } from '../SettingsDropdown';
import { Body } from '../../../services/enums';

type TAppearanceProps = {
  user: Pick<TAuthedUser, 'height' | 'body' | 'smoking'>;
  minHeight: number;
  maxHeight: number;
  onChange: (data: Partial<Pick<TAuthedUser, TAuthedUserUpdatableFields>>) => void;
};

const bodiesOptions: TSettingsDropdownOption<Body>[] = [
  {
    value: Body.SLIM,
    text: 'Slim',
  },
  {
    value: Body.AVERAGE,
    text: 'Average',
  },
  {
    value: Body.ATHLETIC,
    text: 'Athletic',
  },
  {
    value: Body.CURVY,
    text: 'Curvy',
  },
];

export default function AppearanceCard({ user, minHeight, maxHeight, onChange }: TAppearanceProps) {
  const heightsOptions = useMemo<TSettingsDropdownOption<number>[]>(() => {
    return range(minHeight, maxHeight)
      .map((height) => ({
        value: height, text: `${height} cm`
      }));
  }, [minHeight, maxHeight]);

  const handleUpdateHeight = useCallback((height: number) => {
    onChange({ height });
  }, [onChange]);

  const handleUpdateBody = useCallback((body: Body) => {
    onChange({ body });
  }, [onChange]);

  const handleUpdateSmoking = useCallback((smoking: boolean) => {
    onChange({ smoking })
  }, [onChange]);

  return (
    <SettingsCard header="Appearance">
      <SettingsDropdown<number>
        options={heightsOptions}
        value={user.height}
        label="Height"
        onChange={handleUpdateHeight}
      />
      <SettingsDropdown<Body>
        options={bodiesOptions}
        value={user.body}
        label="Body"
        onChange={handleUpdateBody}
      />
      <View style={styles.smokingCheckboxContainer}>
        <CheckBox
          checked={user.smoking}
          onChange={handleUpdateSmoking}
        >
          I smoke cigarettes
        </CheckBox>
      </View>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  smokingCheckboxContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});
