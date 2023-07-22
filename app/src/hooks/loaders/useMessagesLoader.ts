import useLoader, { TLoader } from '../useLoader';
import { getMessages, TMessage } from '../../repos/messages';

export default function useMessagesLoader(): TLoader<TMessage[], [string?]> {
  return useLoader<TMessage[], [string?]>(
    'messages',
    getMessages,
    ({ messages }) => messages,
    ({ mergeMessages }) => mergeMessages,
  );
}
