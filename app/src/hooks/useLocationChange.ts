import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';

export default function useLocationChange(
  distance: number, // meters
  callback: (latitude: number, longitude: number) => void,
  accuracy: LocationAccuracy = Location.Accuracy.Balanced,
): void {
  const callbackRef = useRef<(latitude: number, longitude: number) => void>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const locationWatcherPromise = Location.watchPositionAsync({
      accuracy,
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
  }, [accuracy, distance]);
}
