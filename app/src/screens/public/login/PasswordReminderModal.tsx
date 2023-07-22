import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Card, Input, Button, Text, Spinner } from '@ui-kitten/components';

import { reset, activate } from '../../../repos/auth';
import useCaller from '../../../hooks/useCaller';
import { isValidEmail, isValidPassword } from '../../../services/utils';
import { ErrorCode, isResponseError } from '../../../core/errors';
import { TConstants } from '../../../repos/constants';
import useToast from '../../../hooks/useToast';

type TPasswordReminderModalProps = {
  visible: boolean;
  onClose: () => void;
  usersConstants: TConstants['users'];
};

export default function PasswordReminderModal({ visible, onClose, usersConstants }: TPasswordReminderModalProps): JSX.Element {
  const toast = useToast();
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmedNewPassword, setConfirmedNewPassword] = useState<string>('');
  const [activationCode, setActivationCode] = useState<string>('');

  const [emailError, setEmailError] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string>('');
  const [activationCodeError, setActivationCodeError] = useState<string>('');
  const [isReset, setIsReset] = useState<boolean>(false);

  const isConfirmedNewPasswordValid = newPassword === confirmedNewPassword;

  const { loading: resetting, error: resetError, call: callReset } = useCaller(async () => {
    await reset(email);
    setIsReset(true);
  });

  const { loading: activating, error: activateError, call: callActivate } = useCaller(async () => {
    await activate(email, activationCode, newPassword);
    handleClose();
    toast('Password has been reset. You can log in.', 'success');
  });

  useEffect(() => {
    if (!resetError) {
      return;
    }
    if (isResponseError(resetError) && resetError.code === ErrorCode.INVALID_PARAMETERS) {
      setEmailError('There is no account registered for given email.');
      return;
    }
    setEmailError('Resetting failed. Please try again.');
  }, [resetError]);

  useEffect(() => {
    if (!activateError) {
      return;
    }
    if (isResponseError(activateError) && activateError.code === ErrorCode.BAD_REQUEST) {
      setActivationCodeError('Invalid code or it has expired. You can try again.');
      return;
    }
    setActivationCodeError('Activation failed. Please try again.');
  }, [activateError]);

  const handleChangeEmail = useCallback((nextEmail: string) => {
    if (emailError && nextEmail) {
      setEmailError('');
    }
    setEmail(nextEmail);
  }, [emailError]);

  const handleChangeNewPassword = useCallback((nextNewPassword: string) => {
    if (newPasswordError && nextNewPassword) {
      setNewPasswordError('');
    }
    setNewPassword(nextNewPassword);
  }, [newPasswordError]);

  const handleChangeActivationCode = useCallback((nextActivationCode: string) => {
    if (activationCodeError && nextActivationCode) {
      setActivationCodeError('');
    }
    setActivationCode(nextActivationCode);
  }, [activationCodeError]);

  const handleResetPassword = useCallback(() => {
    setEmailError('');
    callReset();
  }, [callReset]);

  const handleActivate = useCallback(() => {
    setNewPasswordError('');
    setActivationCodeError('');
    callActivate();
  }, [callActivate]);

  const handleClose = useCallback(() => {
    setEmail('');
    setNewPassword('');
    setConfirmedNewPassword('');
    setActivationCode('');
    setEmailError('');
    setNewPasswordError('');
    setActivationCodeError('');
    setIsReset(false);
    onClose();
  }, [onClose]);

  const renderEmailError = useMemo(() => (
    emailError
      ? () => (
        <Text category="c1" status="danger" style={styles.caption}>
          {emailError}
        </Text>
      )
      : undefined
  ), [emailError]);

  const renderConfirmedNewPasswordError = useMemo(() => (
    isConfirmedNewPasswordValid ? undefined : (
      <Text category="c1" status="danger" style={styles.caption}>
        Confirmed password is not correct.
      </Text>
    )
  ), [isConfirmedNewPasswordValid]);

  const renderActivationCodeCaption = useCallback(() => (
    activationCodeError
      ? (
        <Text category="c1" status="danger" style={styles.caption}>
          {activationCodeError}
        </Text>
      )
      : (
        <Text category="c1" appearance="hint" style={styles.caption}>
          The 6-digit code that we have sent to your email.
        </Text>
      )
  ), [activationCodeError]);

  return (
    <Modal visible={visible} style={styles.modal} backdropStyle={styles.backdrop}>
      <Card style={styles.card}>
        {isReset
          ? (
            <>
              <Text category="h5" style={styles.header}>Set new password details:</Text>
              <View>
                <Input
                  secureTextEntry
                  label="New password"
                  size="large"
                  value={newPassword}
                  onChangeText={handleChangeNewPassword}
                  style={styles.field}
                  status={newPasswordError ? 'danger' : 'basic'}
                  caption={renderNewPasswordCaption}
                />
                <Input
                  secureTextEntry
                  label="Confirm new password"
                  size="large"
                  value={confirmedNewPassword}
                  onChangeText={setConfirmedNewPassword}
                  style={styles.field}
                  status={isConfirmedNewPasswordValid ? 'basic' : 'danger'}
                  caption={renderConfirmedNewPasswordError}
                />
                <Input
                  label="Activation code"
                  size="large"
                  value={activationCode}
                  onChangeText={handleChangeActivationCode}
                  style={styles.field}
                  status={activationCodeError ? 'danger' : 'basic'}
                  caption={renderActivationCodeCaption}
                />
              </View>
            </>
          )
          : (
            <>
              <Text category="h5" style={styles.header}>Enter your email below:</Text>
              <Input
                size="large"
                value={email}
                onChangeText={handleChangeEmail}
                style={styles.field}
                status={emailError ? 'danger' : 'basic'}
                caption={renderEmailError}
              />
            </>
          )
        }
        <View style={styles.buttons}>
          {isReset
            ? (
              <Button
                status="primary"
                appearance={activating ? 'outline' : 'filled'}
                accessoryLeft={activating ? renderSpinner : undefined}
                onPress={handleActivate}
                disabled={activating || !newPassword || !isValidPassword(newPassword, usersConstants.minPasswordLength, usersConstants.maxPasswordLength) || (newPassword !== confirmedNewPassword) || !activationCode || activationCode.length !== 6}
              >
                {activating ? 'ACTIVATING...' : 'ACTIVATE'}
              </Button>
            )
            : (
              <Button
                status="primary"
                appearance={resetting ? 'outline' : 'filled'}
                accessoryLeft={resetting ? renderSpinner : undefined}
                onPress={handleResetPassword}
                disabled={resetting || !email || !isValidEmail(email)}
              >
                {resetting ? 'RESETTING...' : 'RESET PASSWORD'}
              </Button>
            )
          }
          <Button
            status="basic"
            onPress={handleClose}
            disabled={resetting || activating}
          >
            CLOSE
          </Button>
        </View>
      </Card>
    </Modal>
  );
}

function renderSpinner() {
  return <Spinner size="tiny" />;
}

function renderNewPasswordCaption() {
  return (
    <Text category="c2" appearance="hint" style={styles.caption}>
      It should contain at least 8 characters including uppercase and lowercase letters, a number and a special character.
    </Text>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    marginHorizontal: 20,
    padding: 20,
  },
  header: {
    textAlign: 'center',
  },
  field: {
    marginTop: 15,
  },
  caption: {
    marginTop: 3,
    marginHorizontal: 3,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
});
