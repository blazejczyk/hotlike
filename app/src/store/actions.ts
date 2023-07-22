import { TState } from './contexts/state';
import { TAuthedUser } from '../repos/auth';
import { TConstants } from '../repos/constants';
import { TToast } from '../components/Toasts';
import { TConfirmation } from '../components/Confirmation';
import { TSuggestion } from '../repos/suggestions';
import { TUser } from '../repos/users';
import { TPlace } from '../repos/places';
import { TMeeting } from '../repos/meetings';
import { TMessage } from '../repos/messages';
import { TPrediction } from '../repos/predictions';

export enum ActionType {
  STATE_RESET = 'state_reset',
  INITIALIZED_LOADER_ADDED = 'initialized_loader_added',
  INITIALIZED_LOADER_REMOVED = 'initialized_loader_removed',
  TOKEN_SET = 'token_set',
  CONSTANTS_SET = 'constants_set',
  AUTHED_USER_SET = 'authed_user_set',
  TOAST_ADDED = 'toast_added',
  TOAST_REMOVED = 'toast_removed',
  CONFIRMATION_SET = 'set_confirmation',
  PREDICTIONS_SET = 'predictions_set',
  SUGGESTIONS_SET = 'suggestions_set',
  SUGGESTION_REMOVED = 'suggestion_removed',
  USER_SET = 'user_set',
  PLACE_SET = 'place_set',
  SENT_INVITATION_SET = 'sent_invitation_set',
  RECEIVED_INVITATION_SET = 'received_invitation_set',
  ONGOING_MEETING_SET = 'ongoing_meeting_set',
  MESSAGES_SET = 'messages_set',
  MESSAGES_MERGED = 'messages_merged',
}

export type TActionPayload = {
  [ActionType.STATE_RESET]: TState;
  [ActionType.INITIALIZED_LOADER_ADDED]: string;
  [ActionType.INITIALIZED_LOADER_REMOVED]: string;
  [ActionType.TOKEN_SET]: string | null;
  [ActionType.CONSTANTS_SET]: TConstants;
  [ActionType.AUTHED_USER_SET]: TAuthedUser | null;
  [ActionType.TOAST_ADDED]: TToast;
  [ActionType.TOAST_REMOVED]: string;
  [ActionType.CONFIRMATION_SET]: TConfirmation | null;
  [ActionType.PREDICTIONS_SET]: TPrediction[];
  [ActionType.SUGGESTIONS_SET]: TSuggestion[];
  [ActionType.SUGGESTION_REMOVED]: { userId: string; placeId: string; };
  [ActionType.USER_SET]: TUser;
  [ActionType.PLACE_SET]: TPlace;
  [ActionType.SENT_INVITATION_SET]: TMeeting | null;
  [ActionType.RECEIVED_INVITATION_SET]: TMeeting | null;
  [ActionType.ONGOING_MEETING_SET]: TMeeting | null;
  [ActionType.MESSAGES_SET]: TMessage[] | null;
  [ActionType.MESSAGES_MERGED]: TMessage[];
};

type TActionAbstract<TActionType extends ActionType> = {
  type: TActionType;
  payload: TActionPayload[TActionType];
};

export type TAction =
  TActionAbstract<ActionType.STATE_RESET> |
  TActionAbstract<ActionType.INITIALIZED_LOADER_ADDED> |
  TActionAbstract<ActionType.INITIALIZED_LOADER_REMOVED> |
  TActionAbstract<ActionType.TOKEN_SET> |
  TActionAbstract<ActionType.CONSTANTS_SET> |
  TActionAbstract<ActionType.AUTHED_USER_SET> |
  TActionAbstract<ActionType.TOAST_ADDED> |
  TActionAbstract<ActionType.TOAST_REMOVED> |
  TActionAbstract<ActionType.CONFIRMATION_SET> |
  TActionAbstract<ActionType.PREDICTIONS_SET> |
  TActionAbstract<ActionType.SUGGESTIONS_SET> |
  TActionAbstract<ActionType.SUGGESTION_REMOVED> |
  TActionAbstract<ActionType.USER_SET> |
  TActionAbstract<ActionType.PLACE_SET> |
  TActionAbstract<ActionType.SENT_INVITATION_SET> |
  TActionAbstract<ActionType.RECEIVED_INVITATION_SET> |
  TActionAbstract<ActionType.ONGOING_MEETING_SET> |
  TActionAbstract<ActionType.MESSAGES_SET> |
  TActionAbstract<ActionType.MESSAGES_MERGED>;
