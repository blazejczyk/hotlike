import { useMemo } from 'react';
import { Marker, Polyline } from 'react-native-maps';
import { useTheme } from '@ui-kitten/components';

import { TMeeting } from '../../../../repos/meetings';
import SvgIcon from '../../../../components/SvgIcon';
import useReadyLayout from '../../../../hooks/useReadyLayout';

type TOngoingMeetingMapPartProps = {
  ongoingMeeting: TMeeting;
  onReady: () => void;
};

export default function OngoingMeetingDestination({ ongoingMeeting, onReady }: TOngoingMeetingMapPartProps) {
  const theme = useTheme();

  const polyline = useMemo(() => (
    ongoingMeeting.polyline
      ? ongoingMeeting.polyline.map(({ latitude, longitude }) => ({ latitude: Number(latitude), longitude: Number(longitude) }))
      : null
  ), [ongoingMeeting]);

  const placeCoordinate = useMemo(() => ({
    latitude: Number(ongoingMeeting.place.coordinate.latitude),
    longitude: Number(ongoingMeeting.place.coordinate.longitude),
  }), [ongoingMeeting.place.coordinate.latitude, ongoingMeeting.place.coordinate.longitude]);

  const handleLayout = useReadyLayout(onReady);

  return (
    <>
      {polyline && <Polyline coordinates={polyline} strokeWidth={3} strokeColor={theme['color-danger-default']}/>}
      <Marker
        coordinate={placeCoordinate}
        title={ongoingMeeting.place.name}
        description={`Meet ${ongoingMeeting.user.name} here.`}
        onLayout={handleLayout}
      >
        <SvgIcon scope="general" name="pin" width="50" height="50" />
      </Marker>
    </>
  );
}
