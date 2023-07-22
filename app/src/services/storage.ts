import AsyncStorage from '@react-native-async-storage/async-storage';

import { tokenStorageKey } from './constants';

export function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(tokenStorageKey);
}

// export async function getToken(): Promise<string> {
//   const token = await AsyncStorage.getItem(tokenStorageKey);
//   return token || '';
// }

export function setToken(token: string): Promise<void> {
  return AsyncStorage.setItem(tokenStorageKey, token);
}

export function removeToken(): Promise<void> {
  return AsyncStorage.removeItem(tokenStorageKey);
}
