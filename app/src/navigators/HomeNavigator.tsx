import { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationOptions } from '@react-navigation/stack/src/types';

import { THomeNavigator } from '../services/navs';
import MapScreen from '../screens/restricted/home/map/MapScreen';
import InvitationScreen from '../screens/restricted/home/invitation/InvitationScreen';
import OngoingMeetingScreen from '../screens/restricted/home/ongoing-meeting/OngoingMeetingScreen';

const { Navigator, Screen } = createStackNavigator<THomeNavigator>();

export default function HomeNavigator(): JSX.Element {
  const screenOptions = useMemo<StackNavigationOptions>(() => ({
    headerShown: false,
    headerMode: undefined,
    animationEnabled: false,
  }), []);

  return (
    <Navigator
      screenOptions={screenOptions}
      initialRouteName="mapScreen"
    >
      <Screen name="mapScreen" component={MapScreen} />
      <Screen name="invitationScreen" component={InvitationScreen} />
      <Screen name="ongoingMeetingScreen" component={OngoingMeetingScreen} />
    </Navigator>
  );
}
