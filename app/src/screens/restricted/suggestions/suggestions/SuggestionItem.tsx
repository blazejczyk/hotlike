import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Text, useTheme } from '@ui-kitten/components';

import { TSuggestion } from '../../../../repos/suggestions';
import SvgIcon from '../../../../components/SvgIcon';
import Photo from '../../../../components/Photo';

type TSuggestionItemProps = {
  suggestion: TSuggestion;
  onPress: () => void;
};

export default function SuggestionItem({ suggestion, onPress }: TSuggestionItemProps): JSX.Element {
  const theme = useTheme();

  const renderTitle = useCallback(() => (
    <Text category="h6" style={styles.listItemTitle}>{suggestion.user.name}, {suggestion.user.age}</Text>
  ), [suggestion.user.name, suggestion.user.age]);

  const renderAccessoryLeft = useCallback(() => (
    <Photo url={suggestion.user.defaultPhoto.thumbnailUrl} size="large" />
  ), [suggestion.user.defaultPhoto.thumbnailUrl]);

  const renderAccessoryRight = useCallback(() => (
    <View style={styles.listItemAccessoryRight}>
      <SvgIcon scope="general" name="cupid" width="18" height="18" />
      <Text category="h6" style={[styles.compatibility]}>
        {suggestion.user.compatibility * 100}%
      </Text>
    </View>
  ), [suggestion.user.compatibility]);

  const renderDescription = useCallback(() => {
    return (
      <View style={styles.listItemDescription}>
        <SvgIcon scope="activities" name={suggestion.place.activity} width="16" height="16" />
        <Text category="p2" style={{ color: theme['color-basic-600'] }}>{suggestion.place.name}</Text>
      </View>
    );
  }, [suggestion.place.activity, suggestion.place.name, theme]);

  const style = useMemo(() => [styles.listItem, { borderBottomColor: theme['color-basic-400'] }], [theme]);

  return (
    <ListItem
      title={renderTitle}
      accessoryLeft={renderAccessoryLeft}
      accessoryRight={renderAccessoryRight}
      description={renderDescription}
      style={style}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 1,
  },
  listItemTitle: {
    marginLeft: 10,
    marginBottom: 3,
  },
  listItemAccessoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compatibility: {
    fontWeight: 'normal',
  },
  listItemDescription: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
