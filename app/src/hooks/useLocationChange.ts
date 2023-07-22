import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export default function useLocationChange(
  distance: number, // meters
  callback: (latitude: number, longitude: number) => void
): void {
  const callbackRef = useRef<(latitude: number, longitude: number) => void>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const locationWatcherPromise = Location.watchPositionAsync({
      accuracy: Location.Accuracy.Balanced, // todo: better accuracy ?
      distanceInterval: distance,
    }, ({ coords: { latitude, longitude } }) => {
      callbackRef.current(latitude, longitude);
    });
    return () => {
      (async () => {
        const { remove } = await locationWatcherPromise;
        remove();
      })();
    };
  }, [distance]);
}
