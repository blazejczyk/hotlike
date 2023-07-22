import { useCallback } from 'react';
import { ListRenderItem } from 'react-native/Libraries/Lists/VirtualizedList';
import { StyleSheet, View } from 'react-native';
import { Divider, List, Text, TopNavigation } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack/src/types';

import ScreenContainer from '../../../../components/ScreenContainer';
import useSuggestionsLoader from '../../../../hooks/loaders/useSuggestionsLoader';
import { TSuggestion } from '../../../../repos/suggestions';
import { TSuggestionsNavigator } from '../../../../services/navs';
import Loading from '../../../../components/Loading';
import LoadingError from '../../../../components/LoadingError';
import SuggestionItem from './SuggestionItem';
import useSocketEvent from '../../../../hooks/useSocketEvent';
import { SocketEvent } from '../../../../core/io';
import useForeground from '../../../../hooks/useForeground';
import useLocationChange from '../../../../hooks/useLocationChange';

type TSuggestionsScreenProps = StackScreenProps<TSuggestionsNavigator, 'suggestionsScreen'>;

export default function SuggestionsScreen({ navigation }: TSuggestionsScreenProps): JSX.Element {
  const { loading, result: suggestions, error, load: reloadSuggestions } = useSuggestionsLoader();

  useForeground(reloadSuggestions);

  useSocketEvent(SocketEvent.INVITATION_RECEIVED, reloadSuggestions);

  useLocationChange(100, reloadSuggestions); // reload suggestions when user changes location by 100 meters

  const renderSuggestionItem = useCallback<ListRenderItem<TSuggestion>>(({ item: suggestion }) => (
    <SuggestionItem
      suggestion={suggestion}
      onPress={() => navigation.navigate('suggestionScreen', { userId: suggestion.user.id, placeId: suggestion.place.id })}
    />
  ), [navigation]);

  return (
    <ScreenContainer>
      <TopNavigation title="Date ideas nearby" alignment="center"/>
      <Divider />
      {loading && !suggestions && <Loading />}
      {error && !suggestions && <LoadingError onReload={reloadSuggestions} />}
      {suggestions && (
        suggestions.length
          ? (
            <List
              data={suggestions}
              renderItem={renderSuggestionItem}
            />
          )
          : (
            <View style={styles.noSuggestions}>
              <Text style={styles.noSuggestionsText}>There's nobody to date around.</Text>
              <Text style={styles.noSuggestionsText}>Go outside and find someone! 🙂</Text>
            </View>
          )
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noSuggestions: {
    margin: 15,
    gap: 10,
    alignItems: 'center',
  },
  noSuggestionsText: {
    textAlign: 'center',
  },
});
