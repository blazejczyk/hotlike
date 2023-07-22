import { get, post, put } from '../core/api';

export type TMessage = {
  id: string;
  type: 'sent' | 'received',
  text: string;
  read: boolean;
  createdAt: string;
};

export function getMessages(newerThan?: string): Promise<TMessage[]> {
  return get<TMessage[]>('messages', newerThan ? { newerThan } : {});
}

export function createMessage(text: string): Promise<TMessage> {
  return post<TMessage>('messages', { text });
}

export function updateMessage(messageId: string, data: Partial<Pick<TMessage, 'read'>>): Promise<TMessage> {
  return put<TMessage>(`messages/${messageId}`, data);
}
