import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

import { INotificationData } from '../services/notifications';

export default function useTapNotification(callback: (data: INotificationData) => void): void {
  const callbackRef = useRef<(data: INotificationData) => void>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const listener = Notifications.addNotificationResponseReceivedListener(({ notification }) => {
      callbackRef.current(notification.request.content.data as INotificationData);
    });
    return () => {
      Notifications.removeNotificationSubscription(listener);
    };
  }, []);
}
