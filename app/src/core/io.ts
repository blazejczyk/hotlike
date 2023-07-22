import { io } from 'socket.io-client';

import config from './config';

export enum SocketEvent {
  INVITATION_RECEIVED = 'invitationReceived',
  INVITATION_ACCEPTED = 'invitationAccepted',
  ONGOING_MEETING_FINISHED = 'ongoingMeetingFinished',
  MESSAGE_RECEIVED = 'messageReceived',
}

const socket = io(config.io.url, { autoConnect: false });

export default socket;
