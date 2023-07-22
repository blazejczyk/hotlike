import { useCallback, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs/src/types';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { TRestrictedScopeNavigator } from '../services/navs';
import SuggestionsNavigator from './SuggestionsNavigator';
import HomeNavigator from './HomeNavigator';
import ProfileScreen from '../screens/restricted/profile/ProfileScreen';
import SvgIcon, { TGeneralIconName } from '../components/SvgIcon';

const { Navigator, Screen } = createBottomTabNavigator<TRestrictedScopeNavigator>();

export default function RestrictedScopeNavigator(): JSX.Element {
  // const theme = useTheme();
  //
  // const indicatorStyle = useMemo(() => ({ backgroundColor: theme['color-danger-500'] }), [theme]);

  const tabBar = useCallback(({ navigation, state }: BottomTabBarProps) => {
    const generalIconsNames: TGeneralIconName[] = ['path', 'signal', 'head'];
    return (
      <BottomNavigation
        selectedIndex={state.index}
        onSelect={(index) => navigation.navigate(state.routeNames[index])}
        // indicatorStyle={indicatorStyle}
      >
        {generalIconsNames.map((iconName, idx) => (
          <BottomNavigationTab
            key={iconName}
            title={() => (
              <SvgIcon
                scope="general"
                name={iconName}
                width="30"
                height="30"
                style={state.index === idx ? styles.activeIcon : styles.icon}
              />
            )}
          />
        ))}
      </BottomNavigation>
    );
  }, []);

  const screenOptions = useMemo<BottomTabNavigationOptions>(() => ({
    headerShown: false,
  }), []);

  return (
    <Navigator
      tabBar={tabBar}
      screenOptions={screenOptions}
      backBehavior="history"
      initialRouteName="homeNavigator"
    >
      <Screen name="homeNavigator" component={HomeNavigator} />
      <Screen name="suggestionsNavigator" component={SuggestionsNavigator} />
      <Screen name="profileScreen" component={ProfileScreen} />
    </Navigator>
  );
}

const styles = StyleSheet.create({
  indicator: {

  },
  icon: {
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 1,
  },
});
