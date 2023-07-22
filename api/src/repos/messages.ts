import { Op } from 'sequelize';
import addMilliseconds from 'date-fns/addMilliseconds';

import { Message } from '../db/schemas/models';

export function getMessages(meetingId: string, newerThan?: Date): Promise<Message[]> {
  return Message.findAll({
    where: {
      meetingId,
      ...(newerThan
        ? ({
            createdAt: {
              [Op.gt]: addMilliseconds(newerThan, 1), // this is because the Sequelize includes the record having "newerThan" value
            }
          })
        : {}
      ),
    },
    order: [
      ['createdAt', 'ASC']
    ],
  });
}

export function getMessage(messageId: string): Promise<Message | null> {
  return Message.findByPk(messageId);
}

export async function updateMessage(messageId: string, data: Partial<Pick<Message, 'read'>>): Promise<Message> {
  const message = await Message.findByPk(messageId);
  if (!message) {
    throw new Error('Message does not exist.');
  }
  await message.update(data);
  return message;
}

export async function createMessage(meetingId: string, userId: string, text: string) {
  const message = await Message.create({ meetingId, userId, text });
  await message.reload();
  return message;
}
