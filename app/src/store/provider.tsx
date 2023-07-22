import { PropsWithChildren } from 'react';
import { Draft } from 'immer';
import { useImmerReducer } from 'use-immer';

import StateContext, { initialState, TState } from './contexts/state';
import DispatchContext from './contexts/dispatch';
import { TAction } from './actions';
import handlers from './handlers';

function reducer(draft: Draft<TState>, { type, payload }: TAction): void {
  const handler = handlers[type];
  // handler(draft, payload as any);
  return handler(draft, payload as any);
}

export default function StoreProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
