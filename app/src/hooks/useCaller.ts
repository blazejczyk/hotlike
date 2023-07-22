import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

export type TCallerState<TResult> = {
  loading: boolean;
  result: TResult | null;
  ready: boolean;
  error: any;
};

type TCaller<TResult, TArgs extends any[]> = TCallerState<TResult> & {
  call: (...args: TArgs) => Promise<void>;
};

export default function useCaller<TResult, TArgs extends any[] = any[]>(
  getCaller: (...args: TArgs) => Promise<TResult>,
  onReady?: (result: TResult) => void,
): TCaller<TResult, TArgs> {
  const [state, setState] = useState<TCallerState<TResult>>({
    loading: false,
    result: null,
    ready: false,
    error: null,
  });

  const getCallerRef = useRef<(...args: TArgs) => Promise<TResult>>(getCaller);
  const onReadyRef = useRef<((result: TResult) => void) | undefined>(onReady);

  useEffect(() => {
    getCallerRef.current = getCaller;
  }, [getCaller]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const call = useCallback<(...args: TArgs) => Promise<void>>(async (...args) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
        ready: false,
        error: null,
      }));
      const loadedResult = await getCallerRef.current(...args);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        result: loadedResult,
        ready: true,
      }));
      if (onReadyRef.current) {
        onReadyRef.current(loadedResult);
      }
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error,
      }));
      console.log('Loading error:');
      console.log(error);
    }
  }, []);

  return useMemo(() => ({ ...state, call }), [state, call]);
}
