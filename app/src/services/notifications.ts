import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export enum NotificationType {
  INVITATION_RECEIVED = 'invitationReceived',
  INVITATION_ACCEPTED = 'invitationAccepted',
  MESSAGE_RECEIVED = 'messageReceived',
}

export interface INotificationData extends Record<string, any> {
  type: NotificationType;
}

export function setForegroundNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function getNotificationsToken(): Promise<string> {
  await Notifications.requestPermissionsAsync(); // we don't have to handle exceptions here
  const notificationsToken = (await Notifications.getExpoPushTokenAsync()).data;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return notificationsToken;
}
