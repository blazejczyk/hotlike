import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Icon, useTheme } from '@ui-kitten/components';

import { TAuthedUser } from '../../../../repos/auth';
import Photo from '../../../../components/Photo';
import useSaver from '../../../../hooks/useSaver';
import { updateAuthedUser } from '../../../../repos/auth';
import useDispatchContext from '../../../../hooks/contexts/useDispatchContext';
import useLocationChange from '../../../../hooks/useLocationChange';

type TUserMarkerProps = {
  user: TAuthedUser;
};

export default function UserMarker({ user }: TUserMarkerProps): JSX.Element {
  const theme = useTheme();
  const [coordinate, setCoordinate] = useState<{ latitude: number; longitude: number; }>({ latitude: Number(user.latitude), longitude: Number(user.longitude) });
  const { setAuthedUser } = useDispatchContext();

  const { save: saveUserCoordinate } = useSaver(async ({ latitude, longitude }: { latitude: string; longitude: string; }) => {
    const updatedUser = await updateAuthedUser({ latitude, longitude });
    setAuthedUser(updatedUser);
  });

  const saveUserCoordinateThrottled = useMemo(() => saveUserCoordinate, [saveUserCoordinate]); // in case if the user is moving very fast

  useLocationChange(10, (latitude, longitude) => {
    setCoordinate({ latitude, longitude });
    saveUserCoordinateThrottled({ latitude: latitude.toString(), longitude: longitude.toString() });
  });

  const photoStyle = useMemo(() => [styles.photo, { borderColor: theme['color-primary-default'] }], [theme]);

  return (
    <Marker coordinate={coordinate} style={styles.marker}>
      <Photo url={user.photos[0].thumbnailUrl} style={photoStyle} />
      <Icon name="arrow-ios-downward-outline" fill={theme['color-primary-default']} style={styles.anchorIcon} />
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderWidth: 2,
  },
  anchorIcon: {
    marginTop: -3,
    width: 20,
    height: 20,
  },
});
