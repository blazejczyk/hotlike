import { io } from '../core/server';

enum SocketEvent {
  INVITATION_RECEIVED = 'invitationReceived',
  INVITATION_ACCEPTED = 'invitationAccepted',
  ONGOING_MEETING_FINISHED = 'ongoingMeetingFinished',
  MESSAGE_RECEIVED = 'messageReceived',
}

export function emitInvitationReceivedSocketEvent(userId: string, inviterUserName: string) {
  io.to(userId).emit(SocketEvent.INVITATION_RECEIVED, { inviterUserName });
}

export function emitInvitationAcceptedSocketEvent(userId: string, inviteeUserName: string) {
  io.to(userId).emit(SocketEvent.INVITATION_ACCEPTED, { inviteeUserName });
}

export function emitOngoingMeetingFinishedSocketEvent(userId: string) {
  io.to(userId).emit(SocketEvent.ONGOING_MEETING_FINISHED);
}

export function emitMessageReceivedSocketEvent(userId: string) {
  io.to(userId).emit(SocketEvent.MESSAGE_RECEIVED);
}
