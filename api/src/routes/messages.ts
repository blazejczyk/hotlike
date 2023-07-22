import { query, param, body } from 'express-validator';

import { route } from '../core/request';
import { getMessages, updateMessage, createMessage } from '../repos/messages';
import { getOngoingMeeting } from '../repos/meetings';
import { Message } from '../db/schemas/models';
import { InternalError, NotFoundError } from '../core/errors';
import { messagesConstants } from '../services/constants';
import { isMessageId } from '../services/validators';
import { emitMessageReceivedSocketEvent } from '../services/events';
import { notifyAboutReceivedMessage } from '../services/notifications';

type TNormalizedMessage = {
  id: string;
  type: 'sent' | 'received',
  text: string;
  read: boolean;
  createdAt: Date;
};

export default [
  route<TNormalizedMessage[]>({
    method: 'get',
    path: '/messages',
    restricted: true,
    validations: [
      query('newerThan')
        .optional()
        .isISO8601()
    ],
    callback: async ({ session, req: { query } }) => {
      const ongoingMeeting = await getOngoingMeeting(session.userId);
      if (!ongoingMeeting) {
        // throw new NotFoundError('There is no ongoing meeting.');
        return [];
      }
      const messages = await getMessages(ongoingMeeting.id, query.newerThan ? new Date(query.newerThan as string) : undefined);
      return messages.map((message) => normalizeMessage(message, session.userId));
    },
  }),

  route<TNormalizedMessage, [], { text: string }>({
    method: 'post',
    path: '/messages',
    restricted: true,
    validations: [
      body('text')
        .isString().bail()
        .isLength({ min: messagesConstants.minTextLength, max: messagesConstants.maxTextLength }),
    ],
    callback: async ({ session, req: { body } }) => {
      const ongoingMeeting = await getOngoingMeeting(session.userId);
      if (!ongoingMeeting) {
        throw new NotFoundError('There is no ongoing meeting.');
      }
      const message = await createMessage(ongoingMeeting.id, session.userId, body.text);
      const recipientUser = session.userId === ongoingMeeting.inviterUserId ? ongoingMeeting.inviteeUser : ongoingMeeting.inviterUser;
      if (!recipientUser) {
        throw new InternalError('Message has missing data.');
      }
      emitMessageReceivedSocketEvent(recipientUser.id);
      if (recipientUser.notificationsToken) {
        notifyAboutReceivedMessage(recipientUser.notificationsToken);
      }
      return normalizeMessage(message, session.userId);
    },
  }),

  route<TNormalizedMessage, ['messageId'], { read: boolean }>({
    method: 'put',
    path: '/messages/:messageId',
    restricted: true,
    validations: ({ session: { userId } }) => [
      param('messageId')
        .isUUID(4).bail()
        .custom(isMessageId()),
      body('read')
        .isBoolean(),
    ],
    callback: async ({ req: { params, body }, session }) => {
      const updatedMessage = await updateMessage(params.messageId, { read: body.read });
      return normalizeMessage(updatedMessage, session.userId);
    },
  }),
];

function normalizeMessage({ id, userId: senderUserId, text, read, createdAt }: Message, userId: string): TNormalizedMessage {
  return {
    id,
    type: senderUserId === userId ? 'sent' : 'received',
    text,
    read,
    createdAt,
  };
}
