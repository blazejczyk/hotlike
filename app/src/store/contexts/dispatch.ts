import { createContext, Dispatch } from 'react';

import { ActionType, TAction, TActionPayload } from '../actions';

type TDispatcher<TActionType extends ActionType> = (payload: TActionPayload[TActionType]) => void;
type TActionDispatchers = { [TActionType in ActionType]: TDispatcher<TActionType> };

export type TDispatch = {
  resetState: TDispatcher<ActionType.STATE_RESET>;
  addInitializedLoader: TDispatcher<ActionType.INITIALIZED_LOADER_ADDED>;
  removeInitializedLoader: TDispatcher<ActionType.INITIALIZED_LOADER_REMOVED>;
  setToken: TDispatcher<ActionType.TOKEN_SET>;
  setConstants: TDispatcher<ActionType.CONSTANTS_SET>;
  setAuthedUser: TDispatcher<ActionType.AUTHED_USER_SET>;
  addToast: TDispatcher<ActionType.TOAST_ADDED>;
  removeToast: TDispatcher<ActionType.TOAST_REMOVED>;
  setConfirmation: TDispatcher<ActionType.CONFIRMATION_SET>;
  setPredictions: TDispatcher<ActionType.PREDICTIONS_SET>;
  setSuggestions: TDispatcher<ActionType.SUGGESTIONS_SET>;
  removeSuggestion: TDispatcher<ActionType.SUGGESTION_REMOVED>;
  setUser: TDispatcher<ActionType.USER_SET>;
  setPlace: TDispatcher<ActionType.PLACE_SET>;
  setSentInvitation: TDispatcher<ActionType.SENT_INVITATION_SET>;
  setReceivedInvitation: TDispatcher<ActionType.RECEIVED_INVITATION_SET>;
  setOngoingMeeting: TDispatcher<ActionType.ONGOING_MEETING_SET>;
  setMessages: TDispatcher<ActionType.MESSAGES_SET>;
  mergeMessages: TDispatcher<ActionType.MESSAGES_MERGED>;
};

export function getDispatchers(dispatch: Dispatch<TAction>): TDispatch {
  const actionsDispatchers = Object.values(ActionType).reduce<TActionDispatchers>((obj, actionType) => {
    obj[actionType] = (payload) => dispatch({ type: actionType, payload: payload as any });
    return obj;
  }, {} as TActionDispatchers);

  return {
    resetState: actionsDispatchers[ActionType.STATE_RESET],
    addInitializedLoader: actionsDispatchers[ActionType.INITIALIZED_LOADER_ADDED],
    removeInitializedLoader: actionsDispatchers[ActionType.INITIALIZED_LOADER_REMOVED],
    setToken: actionsDispatchers[ActionType.TOKEN_SET],
    setConstants: actionsDispatchers[ActionType.CONSTANTS_SET],
    setAuthedUser: actionsDispatchers[ActionType.AUTHED_USER_SET],
    addToast: actionsDispatchers[ActionType.TOAST_ADDED],
    removeToast: actionsDispatchers[ActionType.TOAST_REMOVED],
    setConfirmation: actionsDispatchers[ActionType.CONFIRMATION_SET],
    setPredictions: actionsDispatchers[ActionType.PREDICTIONS_SET],
    setSuggestions: actionsDispatchers[ActionType.SUGGESTIONS_SET],
    removeSuggestion: actionsDispatchers[ActionType.SUGGESTION_REMOVED],
    setUser: actionsDispatchers[ActionType.USER_SET],
    setPlace: actionsDispatchers[ActionType.PLACE_SET],
    setSentInvitation: actionsDispatchers[ActionType.SENT_INVITATION_SET],
    setReceivedInvitation: actionsDispatchers[ActionType.RECEIVED_INVITATION_SET],
    setOngoingMeeting: actionsDispatchers[ActionType.ONGOING_MEETING_SET],
    setMessages: actionsDispatchers[ActionType.MESSAGES_SET],
    mergeMessages: actionsDispatchers[ActionType.MESSAGES_MERGED],
  };
}

const DispatchContext = createContext<Dispatch<TAction>>(() => {});

export default DispatchContext;
