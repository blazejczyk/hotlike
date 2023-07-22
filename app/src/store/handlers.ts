import { Draft } from 'immer';
import { remove } from 'lodash';

import { TState } from './contexts/state';
import { ActionType, TActionPayload } from './actions';

type THandlers = { [TActionType in ActionType]: (draft: Draft<TState>, payload: TActionPayload[TActionType]) => void; };

const handlers: THandlers = {
  [ActionType.STATE_RESET]: (draft, state) => {
    return state;
  },

  [ActionType.INITIALIZED_LOADER_ADDED]: (draft, initializedLoaderName) => {
    draft.initializedLoaders.add(initializedLoaderName);
  },

  [ActionType.INITIALIZED_LOADER_REMOVED]: (draft, initializedLoaderName) => {
    draft.initializedLoaders.delete(initializedLoaderName);
  },

  [ActionType.TOKEN_SET]: (draft, token) => {
    draft.token = token;
  },

  [ActionType.CONSTANTS_SET]: (draft, constants) => {
    draft.constants = constants;
  },

  [ActionType.AUTHED_USER_SET]: (draft, authedUser) => {
    draft.authedUser = authedUser;
    // draft.authedUser = isFunction(authedUser) ? authedUser(draft.authedUser as TAuthedUser) : authedUser;
  },

  [ActionType.TOAST_ADDED]: (draft, toast) => {
    draft.toasts.push(toast);
  },

  [ActionType.TOAST_REMOVED]: (draft, toastId) => {
    remove(draft.toasts, { id: toastId });
  },

  [ActionType.CONFIRMATION_SET]: (draft, confirmation) => {
    draft.confirmation = confirmation;
  },

  [ActionType.PREDICTIONS_SET]: (draft, predictions) => {
    draft.predictions = predictions;
  },

  [ActionType.SUGGESTIONS_SET]: (draft, suggestions) => {
    draft.suggestions = suggestions;
  },

  [ActionType.SUGGESTION_REMOVED]: (draft, { userId, placeId }) => {
    if (draft.suggestions) {
      remove(draft.suggestions, { user: { id: userId }, place: { id: placeId } });
    }
  },

  [ActionType.USER_SET]: (draft, user) => {
    draft.usersById.set(user.id, user);
  },

  [ActionType.PLACE_SET]: (draft, place) => {
    draft.placesById.set(place.id, place);
  },

  [ActionType.SENT_INVITATION_SET]: (draft, sentInvitation) => {
    draft.sentInvitation = sentInvitation;
  },

  [ActionType.RECEIVED_INVITATION_SET]: (draft, receivedInvitation) => {
    draft.receivedInvitation = receivedInvitation;
  },

  [ActionType.ONGOING_MEETING_SET]: (draft, ongoingMeeting) => {
    draft.ongoingMeeting = ongoingMeeting;
  },

  [ActionType.MESSAGES_SET]: (draft, messages) => {
    draft.messages = messages;
  },

  [ActionType.MESSAGES_MERGED]: (draft, messages) => {
    const currentMessagesIds = new Set((draft.messages || []).map(({ id }) => id));
    draft.messages = [...(draft.messages || []), ...messages.filter(({ id }) => !currentMessagesIds.has(id))];
  },
};

export default handlers;
