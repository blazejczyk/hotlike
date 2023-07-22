import { useMemo } from 'react';
import { Circle } from 'react-native-maps';
import { useTheme } from '@ui-kitten/components';

import usePredictionsLoader from '../../../../hooks/loaders/usePredictionsLoader';
import useLocationChange from '../../../../hooks/useLocationChange';
import useForeground from '../../../../hooks/useForeground';
import useSocketEvent from '../../../../hooks/useSocketEvent';
import { SocketEvent } from '../../../../core/io';
import { predictionsRadius } from '../../../../services/constants';

export default function Predictions(): JSX.Element {
  const theme = useTheme();
  const { result: predictions, load: reloadPredictions } = usePredictionsLoader();
  // we don't handle errors here because even if it fails it won't block the app working
  // => any further & successful request will fix this and fetch the proper data

  useForeground(reloadPredictions);

  useSocketEvent(SocketEvent.INVITATION_RECEIVED, reloadPredictions);

  useLocationChange(500, reloadPredictions); // reload predictions when user changes location by 500 meters

  const mappedPredictions = useMemo(() => (
    (predictions || []).map((prediction) => ({
      ...prediction,
      coordinate: {
        latitude: Number(prediction.coordinate.latitude),
        longitude: Number(prediction.coordinate.longitude),
      },
    }))
  ), [predictions]);

  return (
    <>
      {mappedPredictions.map(({ id, compatibility, coordinate }) => (
        <Circle
          key={id}
          center={coordinate}
          radius={predictionsRadius}
          fillColor={theme[getFillColor(compatibility)]}
          strokeColor={theme['color-danger-default']}
          strokeWidth={3}
        />
      ))}
    </>
  );
}

function getFillColor(compatibility: number): string {
  if (compatibility > 0.8 && compatibility <= 1) {
    return 'color-danger-transparent-600';
  } else if (compatibility > 0.6 && compatibility <= 0.8) {
    return 'color-danger-transparent-500';
  } else if (compatibility > 0.4 && compatibility <= 0.6) {
    return 'color-danger-transparent-400';
  } else if (compatibility > 0.2 && compatibility <= 0.4) {
    return 'color-danger-transparent-300';
  } else {
    return 'color-danger-transparent-200';
  }
}
