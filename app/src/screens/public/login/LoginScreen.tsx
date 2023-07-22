import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import { Input, Button, Text, Spinner, useTheme } from '@ui-kitten/components';

import { TPublicScopeNavigator } from '../../../services/navs';
import ScreenContainer from '../../../components/ScreenContainer';
import useCaller from '../../../hooks/useCaller';
import { login } from '../../../repos/auth';
import { ErrorCode, isResponseError, TValidationError } from '../../../core/errors';
import useToast from '../../../hooks/useToast';
import { setToken } from '../../../services/storage';
import useDispatchContext from '../../../hooks/contexts/useDispatchContext';
import FacebookButton from '../../../components/FacebookButton';
import PublicScopeHeader from '../../../components/PublicScopeHeader';
import PasswordReminderModal from './PasswordReminderModal';
import useConstantsLoader from '../../../hooks/loaders/useConstantsLoader';
import Loading from '../../../components/Loading';
import LoadingError from '../../../components/LoadingError';
import { getNotificationsToken } from '../../../services/notifications';

type TLoginScreenProps = StackScreenProps<TPublicScopeNavigator, 'loginScreen'>;

export default function LoginScreen({ navigation }: TLoginScreenProps): JSX.Element {
  const theme = useTheme();
  const toast = useToast();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const [passwordReminderVisible, setPasswordReminderVisible] = useState<boolean>(false);

  const dispatchContext = useDispatchContext();

  const { loading: loadingConstants, result: constants, error: constantsLoadingError, load: reloadConstants } = useConstantsLoader();

  const { loading: loadingNotificationsToken, result: notificationsToken, error: notificationsTokenError, call: loadNotificationsToken } = useCaller(getNotificationsToken);

  useEffect(() => {
    loadNotificationsToken();
  }, [loadNotificationsToken]);

  const { loading: logging, error: loginError, call: callLogin } = useCaller(async () => {
    if (!notificationsToken) {
      throw new Error('Notification token is empty.');
    }
    const { token } = await login(email, password, notificationsToken);
    await setToken(token);
    dispatchContext.setToken(token);
  });

  useEffect(() => {
    if (!loginError) {
      return;
    }
    const isLoginResponseError = isResponseError(loginError);
    if (isLoginResponseError && loginError.code === ErrorCode.INVALID_PARAMETERS && (loginError.details as TValidationError[]).find(({ param }) => param === 'email')) {
      setEmailError('Email value is incorrect.');
      return;
    }
    if (isLoginResponseError && loginError.code === ErrorCode.NOT_FOUND) {
      setEmailError('Wrong combination of email & password.');
      setPasswordError('Wrong combination of email & password.');
      return;
    }
    toast('Login failed. Please try again.', 'danger');
  }, [loginError, toast]);

  const handleLogin = useCallback(() => {
    setEmailError('');
    setPasswordError('');
    let hasErrors = false;
    if (!email) {
      setEmailError('Email field cannot be empty.');
      hasErrors = true;
    }
    if (!password) {
      setPasswordError('Password field cannot be empty.');
      hasErrors = true;
    }
    if (hasErrors) {
      return;
    }
    callLogin();
  }, [email, password, callLogin]);

  const handleFacebookLogin = useCallback(() => {
    console.log('handle login with facebook');
  }, []);

  const handleChangeEmail = useCallback((nextEmail: string) => {
    if (emailError && nextEmail) {
      setEmailError('');
    }
    setEmail(nextEmail);
  }, [emailError]);

  const handleChangePassword = useCallback((nextPassword: string) => {
    if (passwordError && nextPassword) {
      setPasswordError('');
    }
    setPassword(nextPassword);
  }, [passwordError]);

  const handleRemindPassword = useCallback(() => {
    setPasswordReminderVisible(true);
  }, []);

  const handleClosePasswordReminder = useCallback(() => {
    setPasswordReminderVisible(false);
  }, []);

  const handleCreateAccount = useCallback(() => {
    navigation.navigate('registrationScreen');
  }, [navigation]);

  const handleErrorReload = useCallback(() => {
    if (constantsLoadingError) {
      reloadConstants();
    }
    if (notificationsTokenError) {
      loadNotificationsToken();
    }
  }, [constantsLoadingError, notificationsTokenError, reloadConstants, loadNotificationsToken]);

  const renderEmailError = useMemo(() => (
    emailError
      ? () => (
        <Text category="c1" status="danger" style={styles.errorCaption}>
          {emailError}
        </Text>
      )
      : undefined
  ), [emailError]);

  const renderPasswordError = useMemo(() => (
    passwordError
      ? () => (
        <Text category="c1" status="danger" style={styles.errorCaption}>
          {passwordError}
        </Text>
      )
      : undefined
  ), [passwordError]);

  const linkTextStyle = useMemo(() => [styles.linkText, { color: theme['color-basic-700'] }], [theme]);

  return (
    <ScreenContainer>
      {((loadingConstants && !constants) || (loadingNotificationsToken && !notificationsToken)) && <Loading />}
      {((constantsLoadingError && !constants) || (notificationsTokenError && !notificationsToken)) && <LoadingError onReload={handleErrorReload} />}
      {constants && notificationsToken && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <PublicScopeHeader
              iconName="lock"
              title="Hello there!"
              description="Please log in."
            />
            <View style={styles.fields}>
              <Input
                label="Email"
                size="large"
                value={email}
                onChangeText={handleChangeEmail}
                style={styles.field}
                status={emailError ? 'danger' : 'basic'}
                caption={renderEmailError}
              />
              <Input
                secureTextEntry
                label="Password"
                size="large"
                value={password}
                onChangeText={handleChangePassword}
                style={styles.field}
                status={passwordError ? 'danger' : 'basic'}
                caption={renderPasswordError}
              />
              <View style={styles.buttons}>
                <Button
                  status="primary"
                  appearance={logging ? 'outline' : 'filled'}
                  accessoryLeft={logging ? renderSpinner : undefined}
                  onPress={handleLogin}
                  style={styles.button}
                  disabled={logging}
                >
                  {logging ? 'LOGGING IN...' : 'LOG IN'}
                </Button>
                <FacebookButton
                  text="LOG IN WITH FACEBOOK"
                  disabled={logging}
                  onPress={handleFacebookLogin}
                />
              </View>
              <View style={styles.links}>
                <TouchableOpacity onPress={handleRemindPassword} style={styles.link}>
                  <Text category="p1" appearance="hint" style={linkTextStyle}>Forgot my password</Text>
                </TouchableOpacity>
                <Text category="p1" status="basic" appearance="hint" style={styles.linksDivider}>|</Text>
                <TouchableOpacity onPress={handleCreateAccount} style={styles.link}>
                  <Text category="p1" appearance="hint" style={linkTextStyle}>Create new account</Text>
                </TouchableOpacity>
              </View>
            </View>
            <PasswordReminderModal visible={passwordReminderVisible} onClose={handleClosePasswordReminder} usersConstants={constants.users} />
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
    </ScreenContainer>
  );
}

function renderSpinner() {
  return <Spinner size="tiny" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  fields: {
    marginHorizontal: 30,
  },
  field: {
    marginVertical: 8,
  },
  buttons: {
    marginTop: 20,
  },
  button: {
    marginBottom: 12,
  },
  facebookIcon: {
    width: 22,
    height: 22,
  },
  errorCaption: {
    marginTop: 3,
    marginHorizontal: 3,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  linksDivider: {
    marginHorizontal: 3,
  },
  link: {
    flex: 1,
  },
  linkText: {
    textAlign: 'center',
  },
});
