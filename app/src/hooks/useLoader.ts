import { useEffect, useMemo, useRef } from 'react';

import useCaller, { TCallerState } from './useCaller';
import useStateContext from './contexts/useStateContext';
import useDispatchContext from './contexts/useDispatchContext';
import { initialState, TState } from '../store/contexts/state';
import { TDispatch } from '../store/contexts/dispatch';
import { ErrorCode, isResponseError } from '../core/errors';
import { removeToken } from '../services/storage';

export type TLoader<TResult, TArgs extends any[] = any[]> = TCallerState<TResult> & {
  load: (...args: TArgs) => Promise<void>;
};

export default function useLoader<TResult, TArgs extends any[] = any[]>( // 'TResult' generic says what result is actually accepted by api, not by state
  loaderName: string,
  getLoader: (...args: TArgs | []) => Promise<TResult>,
  stateGetter: (state: TState) => TResult | null,
  stateSetter: (dispatch: TDispatch) => (result: TResult) => void,
): TLoader<TResult, TArgs> {
  const stateGetterRef = useRef<(state: TState) => TResult | null>(stateGetter);
  const stateSetterRef = useRef<(dispatch: TDispatch) => (result: TResult) => void>(stateSetter);

  useEffect(() => {
    stateGetterRef.current = stateGetter;
  }, [stateGetter]);

  useEffect(() => {
    stateSetterRef.current = stateSetter;
  }, [stateSetter]);

  const state = useStateContext();
  const { initializedLoaders } = state;
  const storedResult = stateGetterRef.current(state) || null;
  const isInitialized = initializedLoaders.has(loaderName);

  const dispatch = useDispatchContext();
  const { addInitializedLoader } = dispatch;
  const caller = useCaller(getLoader, (result) => stateSetterRef.current(dispatch)(result));
  const { loading, ready, error, call } = caller;

  useEffect(() => {
    if (!isInitialized && !storedResult) {
      call();
      addInitializedLoader(loaderName);
    }
  }, [isInitialized, storedResult, call, addInitializedLoader, loaderName]);

  useEffect(() => {
    (async () => {
      if (error && isResponseError(error) && error.code === ErrorCode.UNAUTHORIZED) {
        await removeToken();
        dispatch.resetState(initialState);
      }
    })();
  }, [error, dispatch]);

  // todo: there's a minor issue while storedResult is not set yet => this causes loading = false and error = false despite the fact the result is ready.
  return useMemo(() => ({ loading, ready, error, result: storedResult, load: call }), [loading, ready, error, storedResult, call]);
  // return useMemo(() => ({ loading, ready, error, result, load: call }), [loading, ready, error, result, call]);
  // return useMemo(() => ({ loading, ready, error, result: storedResult ?? result, load: call }), [loading, result, ready, error, storedResult, call]);
}
