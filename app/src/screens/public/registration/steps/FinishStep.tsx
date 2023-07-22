import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Input, Spinner, Text } from '@ui-kitten/components';

import PublicScopeHeader from '../../../../components/PublicScopeHeader';
import { activate, reset, TRegisteredAuthedUser } from '../../../../repos/auth';
import useCaller from '../../../../hooks/useCaller';
import { ErrorCode, isResponseError } from '../../../../core/errors';
import useToast from '../../../../hooks/useToast';

type TFinishStepProps = {
  registeredAuthedUser: TRegisteredAuthedUser;
  onComplete: () => void;
};

export default function FinishStep({ registeredAuthedUser, onComplete }: TFinishStepProps): JSX.Element {
  const toast = useToast();
  const [activationCode, setActivationCode] = useState<string>('');
  const [activationCodeError, setActivationCodeError] = useState<string>('');

  const { loading: activating, error: activateError, call: callActivate } = useCaller(async () => {
    await activate(registeredAuthedUser.email, activationCode);
    toast('Account has been activated. You can log in.', 'success');
    onComplete();
  });

  const { loading: resetting, error: resetError, call: callReset } = useCaller(async () => {
    await reset(registeredAuthedUser.email);
    toast('New activation code has been sent.', 'info');
  });

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

  useEffect(() => {
    if (resetError) {
      toast('Regenerating failed. Please try again.', 'danger');
    }
  }, [resetError, toast]);

  const handleChangeActivationCode = useCallback((nextActivationCode: string) => {
    if (activationCodeError && nextActivationCode) {
      setActivationCodeError('');
    }
    setActivationCode(nextActivationCode);
  }, [activationCodeError]);

  const handleActivate = useCallback(() => {
    setActivationCodeError('');
    callActivate();
  }, [callActivate]);

  const handleReset = useCallback(() => {
    setActivationCodeError('');
    callReset();
  }, [callReset]);

  const renderActivationCodeCaption = useMemo(() => (
    activationCodeError
      ? () => (
        <Text category="c1" status="danger" style={styles.activationCodeCaption}>
          {activationCodeError}
        </Text>
      )
      : undefined
  ), [activationCodeError]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PublicScopeHeader
        iconName="champagne"
        title="Everything's ready!"
        description="Your account has been created."
      />
      <View style={styles.content}>
        <Text appearance="hint" style={styles.info}>
          Please note that because you used the password to sign up, <Text appearance="hint" style={styles.infoImportant}>you have to activate your account</Text> using the code we have just sent you by email. This must be done before first log in.
        </Text>
        <Input
          label="Activation code"
          size="large"
          value={activationCode}
          onChangeText={handleChangeActivationCode}
          style={styles.field}
          status={activationCodeError ? 'danger' : 'basic'}
          caption={renderActivationCodeCaption}
        />
        <View style={styles.buttons}>
          <Button
            status="info"
            appearance={activating ? 'outline' : 'filled'}
            accessoryLeft={activating ? renderSpinner : undefined}
            onPress={handleActivate}
            disabled={activating || resetting || !activationCode || activationCode.length !== 6}
          >
            {activating ? 'ACTIVATING...' : 'ACTIVATE'}
          </Button>
          <Button
            status="basic"
            appearance="outline"
            accessoryLeft={resetting ? renderSpinner : undefined}
            onPress={handleReset}
            disabled={activating || resetting}
          >
            {resetting ? 'REGENERATING...' : 'REGENERATE CODE'}
          </Button>
        </View>
      </View>
    </ScrollView>
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
  content: {
    marginTop: 10,
    marginHorizontal: 30,
  },
  info: {
    textAlign: 'center',
  },
  infoImportant: {
    fontWeight: 'bold',
  },
  field: {
    marginTop: 15,
  },
  activationCodeCaption: {
    marginTop: 3,
    marginHorizontal: 3,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  loginIcon: {
    width: 22,
    height: 22,
  },
});
