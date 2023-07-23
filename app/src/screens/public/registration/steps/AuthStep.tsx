import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Input, CheckBox } from '@ui-kitten/components';

import PublicScopeHeader from '../../../../components/PublicScopeHeader';
import { TRegisteredAuthedUser } from '../../../../repos/auth';
import ContinueButton from '../ContinueButton';
import FacebookButton from '../../../../components/FacebookButton';
import { isValidEmail } from '../../../../services/utils';
import { ErrorCode, isResponseError, TValidationError } from '../../../../core/errors';
import useToast from '../../../../hooks/useToast';
import PrivacyPolicyModal from '../PrivacyPolicyModal';

type TAuthStepProps = {
  registeredAuthedUser: TRegisteredAuthedUser;
  registering: boolean;
  registrationError: any;
  onChange: (data: Partial<TRegisteredAuthedUser>) => void;
  onComplete?: () => void;
};

export default function AuthStep({ registeredAuthedUser: { email, password }, registering, registrationError, onChange, onComplete }: TAuthStepProps): JSX.Element {
  const toast = useToast();
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState<boolean>(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>('');

  const handleEmailChange = useCallback((nextEmail: string) => {
    if (emailError && nextEmail) {
      setEmailError('');
    }
    onChange({ email: nextEmail });
  }, [emailError, onChange]);

  const handlePasswordChange = useCallback((nextPassword: string) => {
    onChange({ password: nextPassword });
  }, [onChange]);

  const handleFacebookRegistration = useCallback(() => {

  }, []);

  const handleShowPrivacyPolicy = useCallback(() => {
    setPrivacyPolicyVisible(true);
  }, []);

  const handleHidePrivacyPolicy = useCallback(() => {
    setPrivacyPolicyVisible(false);
  }, []);

  useEffect(() => {
    if (!registrationError) {
      return;
    }
    if (isResponseError(registrationError) && registrationError.code === ErrorCode.INVALID_PARAMETERS && (registrationError.details as TValidationError[]).find(({ param }) => param === 'email')) {
      setEmailError('Email is invalid or already registered.');
      return;
    }
    toast('Registration failed. Please try again.', 'danger');
  }, [registrationError, toast]);

  const renderEmailErrorCaption = useMemo(() => (
    emailError
      ? () => (
        <Text category="c2" status="danger" style={styles.caption}>
          {emailError}
        </Text>
      )
      : undefined
  ), [emailError]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PublicScopeHeader
        iconName="plug"
        title="Almost done!"
        description="We just need to sign you up."
      />
      <View style={styles.fields}>
        <Input
          label="Email"
          size="large"
          value={email}
          onChangeText={handleEmailChange}
          caption={renderEmailErrorCaption}
          style={styles.field}
        />
        <Input
          secureTextEntry
          label="Password"
          size="large"
          value={password}
          onChangeText={handlePasswordChange}
          caption={renderPasswordCaption}
          style={styles.field}
        />
        <View style={styles.privacyPolicyCheckboxContainer}>
          <CheckBox
            checked={privacyPolicyAccepted}
            onChange={setPrivacyPolicyAccepted}
          >
            {(props) => (
              <Text {...props}>
                I accept the app's <Text category="p2" status="info" onPress={handleShowPrivacyPolicy}>privacy policy</Text>.
              </Text>
            )}
          </CheckBox>
        </View>
        <ContinueButton text="FINISH" loading={registering} onComplete={privacyPolicyAccepted ? onComplete : undefined} />
        {/*<View style={styles.facebookRegistrationInfo}>*/}
        {/*  <Text appearance="hint">OR if you don't like setting password:</Text>*/}
        {/*</View>*/}
        {/*<FacebookButton text="SIGN UP WITH FACEBOOK" disabled={registering || !email || !isValidEmail(email)} onPress={handleFacebookRegistration} />*/}
      </View>
      <PrivacyPolicyModal visible={privacyPolicyVisible} onClose={handleHidePrivacyPolicy} />
    </ScrollView>
  );
}

function renderPasswordCaption() {
  return (
    <Text category="c2" appearance="hint" style={styles.caption}>
      It should contain at least 8 characters including uppercase and lowercase letters, a number and a special character.
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  fields: {
    marginTop: 10,
    marginHorizontal: 30,
  },
  field: {
    marginBottom: 15,
  },
  caption: {
    marginTop: 3,
    marginHorizontal: 3,
  },
  privacyPolicyCheckboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  facebookRegistrationInfo: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
});
