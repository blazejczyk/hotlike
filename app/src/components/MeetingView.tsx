import { PropsWithChildren, useMemo } from 'react';
import { Text, useTheme } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import SvgIcon from './SvgIcon';
import PhotosView from './PhotosView';
import { TUser } from '../repos/users';
import { TPlace } from '../repos/places';

type TMeetingViewProps = {
  user: TUser;
  place: TPlace;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function MeetingView({ user, place, contentStyle, children }: PropsWithChildren<TMeetingViewProps>): JSX.Element {
  const theme = useTheme();

  const compatibilityStyle = useMemo(() => [
    styles.compatibility,
    { color: theme[getCompatibilityColor(user.compatibility)] }
  ], [theme, user.compatibility]);

  return (
    <PhotosView photos={user.photos}>
      <Text category="s2">Meeting point:</Text>
      <View style={styles.placeInfo}>
        <SvgIcon scope="activities" name={place.activity} width="20" height="20" />
        <Text style={styles.placeName}>{place.name}</Text>
      </View>
      <View style={styles.compatibilityInfo}>
        <SvgIcon scope="general" name="cupid" width="20" height="20" />
        <Text style={styles.compatibilityMessage}>Your compatibility is:</Text>
        <Text category="h6" style={compatibilityStyle}>{user.compatibility * 100}%</Text>
      </View>
      <View style={contentStyle}>
        {children}
      </View>
    </PhotosView>
  );
}

function getCompatibilityColor(compatibility: number): string {
  if (compatibility > 0.8 && compatibility <= 1) {
    return 'color-danger-700';
  } else if (compatibility > 0.6 && compatibility <= 0.8) {
    return 'color-danger-600';
  } else if (compatibility > 0.4 && compatibility <= 0.6) {
    return 'color-danger-500';
  } else if (compatibility > 0.2 && compatibility <= 0.4) {
    return 'color-danger-400';
  } else {
    return 'color-danger-300';
  }
}

// export function getCompatibilityColor(compatibility: number): string {
//   if (compatibility > 0.8 && compatibility <= 1) {
//     return 'color-success-700';
//   } else if (compatibility > 0.6 && compatibility <= 0.8) {
//     return 'color-success-600';
//   } else if (compatibility > 0.4 && compatibility <= 0.6) {
//     return 'color-warning-600';
//   } else if (compatibility > 0.2 && compatibility <= 0.4) {
//     return 'color-warning-700';
//   } else {
//     return 'color-danger-500';
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeInfo: {
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeName: {
    fontWeight: 'bold',
  },
  compatibilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  compatibilityMessage: {
    marginLeft: 7,
  },
  compatibility: {
    marginLeft: 5,
  },
});
