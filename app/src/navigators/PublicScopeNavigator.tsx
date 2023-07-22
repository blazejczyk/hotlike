import { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationOptions } from '@react-navigation/stack/src/types';

import { TPublicScopeNavigator } from '../services/navs';
import LoginScreen from '../screens/public/login/LoginScreen';
import RegistrationScreen from '../screens/public/registration/RegistrationScreen';

const { Navigator, Screen } = createStackNavigator<TPublicScopeNavigator>();

export default function PublicScopeNavigator(): JSX.Element {
  const screenOptions = useMemo<StackNavigationOptions>(() => ({
    headerShown: false,
    headerMode: undefined,
    animationEnabled: false,
  }), []);

  return (
    <Navigator
      screenOptions={screenOptions}
      initialRouteName="loginScreen"
    >
      <Screen name="loginScreen" component={LoginScreen} />
      <Screen name="registrationScreen" component={RegistrationScreen} />
      {/*<Screen name="passwordReminderScreen" component={OngoingMeetingScreen} />*/}
    </Navigator>
  );
}
