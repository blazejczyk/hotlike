import { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Button, Icon, Input, Toggle, useTheme } from '@ui-kitten/components';

import { TAuthedUser, TAuthedUserUpdatableFields, logout, deleteAuthedUser } from '../../../repos/auth';
import SettingsCard from '../SettingsCard';
import useConfirm from '../../../hooks/useConfirm';
import { removeToken } from '../../../services/storage';
import useDispatchContext from '../../../hooks/contexts/useDispatchContext';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TRestrictedScopeNavigator } from '../../../services/navs';
import { initialState } from '../../../store/contexts/state';
import useSaver from '../../../hooks/useSaver';

type TAccountCardProps = {
  user: TAuthedUser;
  onChange: (data: Partial<Pick<TAuthedUser, TAuthedUserUpdatableFields>>) => void;
};

export default function AccountCard({ user, onChange }: TAccountCardProps) {
  const navigation = useNavigation<BottomTabNavigationProp<TRestrictedScopeNavigator, 'profileScreen'>>();
  const theme = useTheme();
  const confirm = useConfirm();
  const [email, setEmail] = useState(user.email);
  const emailInputRef = useRef<Input | null>(null);
  const { resetState } = useDispatchContext();

  const isEmailEdited = email !== user.email;

  const handleUpdateEmail = useCallback(() => {
    if (isEmailEdited) {
      confirm(`Are you sure you want to change your email to ${email}?`, () => {
        onChange({ email });
      });
    }
  }, [confirm, email, isEmailEdited, onChange]);

  const renderEmailConfirmationIcon = useCallback(() => {
    return (
      <TouchableWithoutFeedback onPress={() => emailInputRef.current?.blur()}>
        <Icon name="checkmark-outline" fill={theme['color-basic-600']} style={styles.emailConfirmationIcon} />
      </TouchableWithoutFeedback>
    );
  }, [theme]);

  const renderLogoutButtonIcon = useCallback(() => (
    <Icon name="power-outline" fill={theme['color-warning-500']} style={styles.buttonIcon} />
  ), [theme]);

  const renderDeleteButtonIcon = useCallback(() => (
    <Icon name="trash-outline" fill={theme['color-danger-500']} style={styles.buttonIcon} />
  ), [theme]);

  const handleUpdateDisabled = useCallback((disabled: boolean) => {
    onChange({ disabled });
  }, [onChange]);

  const clean = useCallback(async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'homeNavigator' }],
      })
    );
    await removeToken();
    resetState(initialState);
  }, [navigation, resetState]);

  const handleDelete = useCallback(() => {
    confirm('Are you sure you want to delete your account?', async () => {
      await deleteAuthedUser();
      clean();
    });
  }, [confirm, clean]);

  const { save: callLogout, loading: loggingOut } = useSaver(logout, clean);

  return (
    <SettingsCard header="Account">
      <Input
        ref={emailInputRef}
        label="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={handleUpdateEmail}
        accessoryRight={isEmailEdited ? renderEmailConfirmationIcon : undefined}
        style={styles.emailInput}
      />
      <View style={styles.toggleContainer}>
        <Toggle
          checked={user.disabled}
          onChange={handleUpdateDisabled}
          style={styles.disabledToggle}
        >
          Disable my account temporarily
        </Toggle>
      </View>
      <View style={styles.buttons}>
        <Button
          size="small"
          status="warning"
          appearance="outline"
          accessoryLeft={renderLogoutButtonIcon}
          disabled={loggingOut}
          onPress={callLogout}
          style={styles.button}
        >
          Logout
        </Button>
        <Button
          size="small"
          status="danger"
          appearance="outline"
          accessoryLeft={renderDeleteButtonIcon}
          onPress={handleDelete}
          style={styles.button}
        >
          Delete account
        </Button>
      </View>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  emailInput: {
    marginBottom: 10,
  },
  emailConfirmationIcon: {
    width: 22,
    height: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  disabledToggle: {
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    flex: 1,
  },
  buttonIcon: {
    width: 18,
    height: 18,
  },
});
