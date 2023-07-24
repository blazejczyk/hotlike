import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Datepicker, Input, Radio, Text } from '@ui-kitten/components';
import { TextProps } from '@ui-kitten/components/ui/text/text.component';
import subYears from 'date-fns/subYears';
import format from 'date-fns/format';

import SvgIcon from '../../../../components/SvgIcon';
import { TRegisteredAuthedUser } from '../../../../repos/auth';
import ContinueButton from '../ContinueButton';
import PublicScopeHeader from '../../../../components/PublicScopeHeader';
import { Gender } from '../../../../services/enums';

const now = new Date();
const minDateOfBirth = subYears(now, 100);
export const maxDateOfBirth = subYears(now, 18);

type TIdentityStepProps = {
  registeredAuthedUser: TRegisteredAuthedUser;
  onChange: (data: Partial<TRegisteredAuthedUser>) => void;
  onComplete?: () => void;
};

export default function IdentityStep({ registeredAuthedUser: { name, gender, dateOfBirth }, onChange, onComplete }: TIdentityStepProps): JSX.Element {
  const dateOfBirthObj = useMemo(() => new Date(dateOfBirth), [dateOfBirth]);

  const handleNameChange = useCallback((nextName: string) => {
    onChange({ name: nextName });
  }, [onChange]);

  const handleMaleGenderChecked = useCallback(() => {
    onChange({ gender: Gender.MALE });
  }, [onChange]);

  const handleFemaleGenderChecked = useCallback(() => {
    onChange({ gender: Gender.FEMALE });
  }, [onChange]);

  const handleDateOfBirthChange = useCallback((nextDateOfBirthObj: Date) => {
    onChange({ dateOfBirth: format(nextDateOfBirthObj, 'yyyy-MM-dd') });
  }, [onChange]);

  const renderMaleGenderRadioText = useCallback((props: TextProps | undefined) => (
    <View {...props} style={styles.gender}>
      <Text>man</Text>
      <SvgIcon scope="genders" name={Gender.MALE} width="20" height="20" />
    </View>
  ), []);

  const renderFemaleGenderRadioText = useCallback((props: TextProps | undefined) => (
    <View {...props} style={styles.gender}>
      <Text>woman</Text>
      <SvgIcon scope="genders" name={Gender.FEMALE} width="20" height="20" />
    </View>
  ), []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PublicScopeHeader
        iconName={gender === Gender.MALE ? 'boy' : 'girl'}
        title={<>Hi! Nice to see <Text category="h4">you</Text> :).</>}
        description="Tell us something about yourself."
      />
      <View style={styles.fields}>
        <Input
          label="My name is"
          size="large"
          value={name}
          onChangeText={handleNameChange}
          style={styles.field}
        />
        <View style={styles.field}>
          <Text category="c2" appearance="hint" style={styles.genderTitle}>I am a</Text>
          <View style={styles.genders}>
            <Radio checked={gender === Gender.MALE} onChange={handleMaleGenderChecked}>
              {renderMaleGenderRadioText}
            </Radio>
            <Radio checked={gender === Gender.FEMALE} onChange={handleFemaleGenderChecked}>
              {renderFemaleGenderRadioText}
            </Radio>
          </View>
        </View>
        <Datepicker
          label="I was born on"
          date={dateOfBirthObj}
          onSelect={handleDateOfBirthChange}
          min={minDateOfBirth}
          max={maxDateOfBirth}
          size="large"
          caption={renderDateOfBirthCaption}
        />
        <ContinueButton onComplete={onComplete} style={styles.continueButton} />
      </View>
    </ScrollView>
  );
}

function renderDateOfBirthCaption() {
  return (
    <Text category="c2" appearance="hint" style={styles.dateOfBirthCaption}>
      Your date of birth will NOT be displayed anywhere in the app. We need this information in order to know your age and match you with your potential partners. If you're younger than 18 years old you cannot use this app.
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  fields: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
  field: {
    marginBottom: 15,
  },
  genders: {
    marginTop: 5,
    marginHorizontal: 2,
    flexDirection: 'row',
    gap: 15,
  },
  gender: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginHorizontal: 10,
  },
  genderTitle: {
    fontWeight: 'bold',
  },
  dateOfBirthCaption: {
    marginTop: 3,
    marginHorizontal: 3,
  },
  continueButton: {
    marginTop: 25,
  },
});
