import { useContext } from 'react';

import StateContext, { TState } from '../../store/contexts/state';

export default function useStateContext(): TState {
  return useContext(StateContext);
};
