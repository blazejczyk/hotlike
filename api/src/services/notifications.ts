import { Expo } from 'expo-server-sdk';

enum NotificationType {
  INVITATION_RECEIVED = 'invitationReceived',
  INVITATION_ACCEPTED = 'invitationAccepted',
  MESSAGE_RECEIVED = 'messageReceived',
}

const expo = new Expo();

function notify(notificationsToken: string, notificationType: NotificationType, title?: string) {
  expo.sendPushNotificationsAsync([{
    to: notificationsToken,
    sound: 'default',
    title,
    data: {
      type: notificationType,
    },
  }]);
}

export function notifyAboutReceivedInvitation(notificationsToken: string, inviterUserName: string) {
  notify(notificationsToken, NotificationType.INVITATION_RECEIVED, `${inviterUserName} is asking you out! 😍`);
}

export function notifyAboutAcceptedInvitation(notificationsToken: string, inviteeUserName: string) {
  notify(notificationsToken, NotificationType.INVITATION_ACCEPTED, `${inviteeUserName} has accepted your invitation! 🥂`);
}

export function notifyAboutReceivedMessage(notificationsToken: string) {
  notify(notificationsToken, NotificationType.MESSAGE_RECEIVED, 'You have a new message! 💌');
}
