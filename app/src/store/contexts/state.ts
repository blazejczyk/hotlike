import { createContext } from 'react';

import { TConstants } from '../../repos/constants';
import { TAuthedUser } from '../../repos/auth';
import { TToast } from '../../components/Toasts';
import { TConfirmation } from '../../components/Confirmation';
import { TPrediction } from '../../repos/predictions';
import { TSuggestion } from '../../repos/suggestions';
import { TUser } from '../../repos/users';
import { TPlace } from '../../repos/places';
import { TMeeting } from '../../repos/meetings';
import { TMessage } from '../../repos/messages';

export type TState = {
  initializedLoaders: Set<string>;
  token: string | null;
  constants: TConstants | null;
  authedUser: TAuthedUser | null;
  toasts: TToast[];
  confirmation: TConfirmation | null;
  predictions: TPrediction[] | null;
  suggestions: TSuggestion[] | null;
  usersById: Map<string, TUser>;
  placesById: Map<string, TPlace>;
  sentInvitation: TMeeting | null;
  receivedInvitation: TMeeting | null;
  ongoingMeeting: TMeeting | null;
  messages: TMessage[] | null;
};

export const initialState: TState = {
  initializedLoaders: new Set(),
  token: null,
  constants: null,
  authedUser: null,
  toasts: [],
  confirmation: null,
  predictions: null,
  suggestions: null,
  usersById: new Map(),
  placesById: new Map(),
  sentInvitation: null,
  receivedInvitation: null,
  ongoingMeeting: null,
  messages: null,
};

const StateContext = createContext<TState>(initialState);

export default StateContext;
