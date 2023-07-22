import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export default function useForeground(callback: () => void): void {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const callbackRef = useRef<() => void>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if ((appState.current === 'inactive' || appState.current === 'background') && (nextAppState === 'active')) {
        callbackRef.current();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
