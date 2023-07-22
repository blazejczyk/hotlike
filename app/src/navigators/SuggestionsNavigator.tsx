import { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationOptions } from '@react-navigation/stack/src/types';

import { TSuggestionsNavigator } from '../services/navs';
import SuggestionsScreen from '../screens/restricted/suggestions/suggestions/SuggestionsScreen';
import SuggestionScreen from '../screens/restricted/suggestions/suggestion/SuggestionScreen';

const { Navigator, Screen } = createStackNavigator<TSuggestionsNavigator>();

export default function SuggestionsNavigator(): JSX.Element {
  const screenOptions = useMemo<StackNavigationOptions>(() => ({
    headerShown: false,
    headerMode: undefined,
    animationEnabled: false,
  }), []);

  return (
    <Navigator
      screenOptions={screenOptions}
      initialRouteName="suggestionsScreen"
    >
      <Screen name="suggestionsScreen" component={SuggestionsScreen} />
      <Screen name="suggestionScreen" component={SuggestionScreen} />
    </Navigator>
  );
}
