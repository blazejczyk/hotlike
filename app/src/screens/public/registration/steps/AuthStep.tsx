import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Input, CheckBox } from '@ui-kitten/components';

import PublicScopeHeader from '../../../../components/PublicScopeHeader';
import { TRegisteredAuthedUser } from '../../../../repos/auth';
import ContinueButton from '../ContinueButton';
import { ErrorCode, isResponseError, TValidationError } from '../../../../core/errors';
import useToast from '../../../../hooks/useToast';
import PrivacyPolicyModal from '../PrivacyPolicyModal';
import TermsModal from '../TermsModal';
import { isValidEmail, isValidPassword } from '../../../../services/utils';
import { TConstants } from '../../../../repos/constants';

type TAuthStepProps = {
  registeredAuthedUser: TRegisteredAuthedUser;
  registering: boolean;
  registrationError: any;
  usersConstants: TConstants['users'];
  onChange: (data: Partial<TRegisteredAuthedUser>) => void;
  onComplete?: () => void;
};

export default function AuthStep({ registeredAuthedUser: { email, password }, registering, registrationError, usersConstants, onChange, onComplete }: TAuthStepProps): JSX.Element {
  const toast = useToast();
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState<boolean>(false);
  const [termsVisible, setTermsVisible] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handleEmailChange = useCallback((nextEmail: string) => {
    if (emailError && nextEmail) {
      setEmailError('');
    }
    onChange({ email: nextEmail });
  }, [emailError, onChange]);

  const handlePasswordChange = useCallback((nextPassword: string) => {
    if (passwordError && nextPassword) {
      setPasswordError('');
    }
    onChange({ password: nextPassword });
  }, [passwordError, onChange]);

  const handleRegistration = useCallback(() => {
    let hasErrors = false;
    if (!isValidEmail(email)) {
      setEmailError('Email is invalid.');
      hasErrors = true;
    }
    if (!isValidPassword(password || '', usersConstants.minPasswordLength, usersConstants.maxPasswordLength)) {
      setPasswordError('Password is invalid.');
      hasErrors = true;
    }
    if (hasErrors) {
      return;
    }
    if (onComplete) {
      onComplete();
    }
  }, [email, password, usersConstants.maxPasswordLength, usersConstants.minPasswordLength, onComplete]);

  const handleFacebookRegistration = useCallback(() => {

  }, []);

  const handleShowPrivacyPolicy = useCallback(() => {
    setPrivacyPolicyVisible(true);
  }, []);

  const handleHidePrivacyPolicy = useCallback(() => {
    setPrivacyPolicyVisible(false);
  }, []);

  const handleShowTerms = useCallback(() => {
    setTermsVisible(true);
  }, []);

  const handleHideTerms = useCallback(() => {
    setTermsVisible(false);
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

  const renderPasswordCaption = useCallback(() => (
    <Text category="c2" status={passwordError ? 'danger' : 'basic'} appearance="hint" style={styles.caption}>
      It should contain at least 8 characters including uppercase and lowercase letters, a number and a special character.
    </Text>
  ), [passwordError]);

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
          status={emailError ? 'danger' : 'basic'}
          caption={renderEmailErrorCaption}
          style={styles.field}
        />
        <Input
          secureTextEntry
          label="Password"
          size="large"
          value={password}
          onChangeText={handlePasswordChange}
          status={passwordError ? 'danger' : 'basic'}
          caption={renderPasswordCaption}
          style={styles.field}
        />
        <View style={styles.privacyPolicyCheckboxContainer}>
          <CheckBox
            checked={consentAccepted}
            onChange={setConsentAccepted}
          >
            {(props) => (
              <Text {...props}>
                I accept <Text category="p2" status="info" onPress={handleShowPrivacyPolicy}>privacy policy</Text> and <Text category="p2" status="info" onPress={handleShowTerms}>terms of use</Text>.
              </Text>
            )}
          </CheckBox>
        </View>
        <ContinueButton text="FINISH" loading={registering} onComplete={consentAccepted ? handleRegistration : undefined} />
        {/*<View style={styles.facebookRegistrationInfo}>*/}
        {/*  <Text appearance="hint">OR if you don't like setting password:</Text>*/}
        {/*</View>*/}
        {/*<FacebookButton text="SIGN UP WITH FACEBOOK" disabled={registering || !email || !isValidEmail(email)} onPress={handleFacebookRegistration} />*/}
      </View>
      <PrivacyPolicyModal visible={privacyPolicyVisible} onClose={handleHidePrivacyPolicy} />
      <TermsModal visible={termsVisible} onClose={handleHideTerms} />
    </ScrollView>
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
