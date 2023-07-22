import { useEffect, useMemo } from 'react';

import useCaller, { TCallerState } from './useCaller';
import useToast from './useToast';

type TSaver<TResult, TArgs extends any[]> = TCallerState<TResult> & {
  save: (...args: TArgs) => Promise<void>;
};

export default function useSaver<TResult, TArgs extends any[]>(
  getSaver: (...args: TArgs) => Promise<TResult>,
  onReady?: (result: TResult) => void,
): TSaver<TResult, TArgs> {
  const { loading, ready, result, error, call } = useCaller(getSaver, onReady);
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast('Saving failed. Please try again.', 'danger');
    }
  }, [error, toast]);

  return useMemo(() => ({ result, error, loading, ready, save: call }), [loading, ready, result, error, call]);
}
