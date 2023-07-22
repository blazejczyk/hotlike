import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Linking from 'expo-linking';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import { Text } from '@ui-kitten/components';

import ScreenContainer from '../../../../components/ScreenContainer';
import { coordinateDeltas } from '../../../../services/constants';
import UserMarker from './UserMarker';
import useAuthedUserLoader from '../../../../hooks/loaders/useAuthedUserLoader';
import useReceivedInvitationLoader from '../../../../hooks/loaders/useReceivedInvitationLoader';
import useOngoingMeetingLoader from '../../../../hooks/loaders/useOngoingMeetingLoader';
import useCaller from '../../../../hooks/useCaller';
import Loading from '../../../../components/Loading';
import LoadingError from '../../../../components/LoadingError';
import InvitationPreview from './InvitationPreview';
import OngoingMeetingPreview from './OngoingMeetingPreview';
import OngoingMeetingDestination from './OngoingMeetingDestination';
import Predictions from './Predictions';
import { OngoingMeetingTabIndex, THomeNavigator, TRestrictedScopeNavigator } from '../../../../services/navs';
import SvgIcon from '../../../../components/SvgIcon';
import useSocketEvent from '../../../../hooks/useSocketEvent';
import { SocketEvent } from '../../../../core/io';
import useDispatchContext from '../../../../hooks/contexts/useDispatchContext';
import useToast from '../../../../hooks/useToast';
import useForeground from '../../../../hooks/useForeground';
import { getLocation } from '../../../../services/geolocation';
import useTapNotification from '../../../../hooks/useTapNotification';
import { NotificationType } from '../../../../services/notifications';

type TMapScreenProps = StackScreenProps<THomeNavigator, 'mapScreen'>;

export default function MapScreen({ navigation, route }: TMapScreenProps): JSX.Element {
  const toast = useToast();
  const mapViewRef = useRef<MapView>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const { loading: loadingAuthedUser, result: authedUser, error: loadingAuthedUserError, load: reloadAuthedUser } = useAuthedUserLoader();
  const { result: receivedInvitation, load: reloadReceivedInvitation } = useReceivedInvitationLoader();
  const { result: ongoingMeeting, load: reloadOngoingMeeting } = useOngoingMeetingLoader();
  const { setOngoingMeeting, setMessages } = useDispatchContext();

  const { loading: loadingLocation, result: location, error: loadingLocationError, call: loadLocation } = useCaller(
    getLocation,
    ({ coords: { latitude, longitude } }) => {
      const { latitudeDelta, longitudeDelta } = coordinateDeltas;
      setInitialRegion({ latitude, longitude, latitudeDelta, longitudeDelta });
    },
  );

  useEffect(() => {
    loadLocation();
  }, [loadLocation]);

  const handleInvitationPreviewPress = useCallback(() => navigation.navigate('invitationScreen'), [navigation]);
  const handleOngoingMeetingPreviewPress = useCallback(() => navigation.navigate('ongoingMeetingScreen', { tab: null }), [navigation]);

  const handleOngoingMeetingReady = useCallback(() => {
    if (mapViewRef.current && authedUser && ongoingMeeting) {
      mapViewRef.current.fitToCoordinates([
        { latitude: Number(authedUser.latitude), longitude: Number(authedUser.longitude) },
        { latitude: Number(ongoingMeeting.place.coordinate.latitude), longitude: Number(ongoingMeeting?.place.coordinate.longitude) },
      ], { edgePadding });
    }
  }, [authedUser, ongoingMeeting]);

  const handleCenterMapView = useCallback(() => {
    if (mapViewRef.current && authedUser) {
      mapViewRef.current.animateCamera({
        center: { latitude: Number(authedUser.latitude), longitude: Number(authedUser.longitude) },
      });
    }
  }, [authedUser]);

  useForeground(() => {
    reloadReceivedInvitation();
    reloadOngoingMeeting();
  });

  useSocketEvent<{ inviterUserName: string }>(SocketEvent.INVITATION_RECEIVED, async ({ inviterUserName }) => {
    await reloadReceivedInvitation();
    if (!navigation.isFocused()) {
      toast(`${inviterUserName} is asking you out! 😍`, 'info', () => navigation.navigate('invitationScreen'));
    }
  });

  useSocketEvent<{ inviteeUserName: string }>(SocketEvent.INVITATION_ACCEPTED, async ({ inviteeUserName }) => {
    await reloadOngoingMeeting();
    if (!navigation.isFocused()) {
      toast(`You're dating now with ${inviteeUserName}! 🥂`, 'info', () => navigation.navigate('mapScreen'));
    }
  });

  useSocketEvent(SocketEvent.MESSAGE_RECEIVED, async () => {
    const parentNavigation = navigation.getParent();
    if (!parentNavigation) {
      return;
    }
    const { index: parentIndex, routes: parentRoutes } = parentNavigation.getState();
    const parentRouteName = parentRoutes[parentIndex].name as keyof TRestrictedScopeNavigator;
    const { index, routes } = navigation.getState();
    const routeName = routes[index].name;
    if (!(parentRouteName === 'homeNavigator' && routeName === 'ongoingMeetingScreen')) {
      toast('You have a new message! 💌', 'info', () => navigation.navigate('ongoingMeetingScreen', { tab: OngoingMeetingTabIndex.MESSAGES }));
    }
  });

  useSocketEvent(SocketEvent.ONGOING_MEETING_FINISHED, () => {
    setOngoingMeeting(null);
    setMessages(null);
    toast('Your meeting has been finished 🏁.');
  });

  useTapNotification((data) => {
    switch (data.type) {
      case NotificationType.INVITATION_RECEIVED:
        return navigation.navigate('invitationScreen');
      case NotificationType.INVITATION_ACCEPTED:
        return navigation.navigate('mapScreen');
      case NotificationType.MESSAGE_RECEIVED:
        return navigation.navigate('ongoingMeetingScreen', { tab: OngoingMeetingTabIndex.MESSAGES });
    }
  });

  return (
    <ScreenContainer>
      {((loadingLocation && !location) || (loadingAuthedUser && !authedUser)) && <Loading />}
      {loadingLocationError && !location && (
        <LoadingError
          onReload={loadLocation}
          headErrorMessage="Geolocation must be enabled 🛰️"
          detailedErrorMessage={(
            <>Please make sure the geolocation is enabled and the <Text status="primary" style={styles.textImportant} onPress={Linking.openSettings}>permission</Text> for the app is granted.</>
          )}
        />
      )}
      {loadingAuthedUserError && !authedUser && <LoadingError onReload={reloadAuthedUser} />}
      {authedUser && initialRegion && (
        <View style={styles.mapViewContainer}>
          <MapView ref={mapViewRef} initialRegion={initialRegion} rotateEnabled={false} customMapStyle={mapStyle} style={styles.mapView}>
            <UserMarker user={authedUser} />
            {ongoingMeeting
              ? <OngoingMeetingDestination ongoingMeeting={ongoingMeeting} onReady={handleOngoingMeetingReady} />
              : <Predictions />
            }
          </MapView>
          <TouchableOpacity style={styles.target} onPress={handleCenterMapView}>
            <SvgIcon scope="general" name="target" width="40" height="40" />
          </TouchableOpacity>
          {receivedInvitation && <InvitationPreview invitation={receivedInvitation} onPress={handleInvitationPreviewPress} />}
          {ongoingMeeting && <OngoingMeetingPreview ongoingMeeting={ongoingMeeting} onPress={handleOngoingMeetingPreviewPress} />}
        </View>
      )}
    </ScreenContainer>
  );
}

const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }
];

const edgePadding = {
  top: 50,
  left: 50,
  bottom: 50,
  right: 50,
};

const styles = StyleSheet.create({
  mapViewContainer: {
    flex: 1,
  },
  mapView: {
    width: Dimensions.get('window').width,
    flex: 1,
  },
  target: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textImportant: {
    fontWeight: 'bold',
  },
});
