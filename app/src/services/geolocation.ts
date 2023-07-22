import { LocationObject } from 'expo-location/src/Location.types';
import * as Location from 'expo-location';

import { PermissionError } from './exceptions';

export async function getLocation(): Promise<LocationObject> {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new PermissionError('Location access denied.');
  }
  /**
   * Expo's Location.getCurrentPositionAsync function sometimes hangs forever which seems to be a bug:
   * https://github.com/expo/expo/issues/10756
   *
   * This sometimes happens when user log out and log in again. Usually the second request solves the problem.
   */
  const maxTries = 3;
  const timeoutMs = 5000;
  let tries = 1;
  while (tries <= maxTries) {
    const location = await Promise.race<LocationObject | null>([
      new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs)),
      Location.getCurrentPositionAsync(),
    ]);
    if (location) {
      return location;
    }
    tries++;
  }
  throw new Error('Location timeout.');
}
