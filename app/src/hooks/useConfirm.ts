import { useCallback } from 'react';

import useDispatchContext from './contexts/useDispatchContext';

type TConfirm = (message: string, onConfirm: () => void) => void;

export default function useConfirm(): TConfirm {
  const { setConfirmation } = useDispatchContext();

  return useCallback((message: string, onConfirm: () => void) => {
    setConfirmation({ message, onConfirm });
  }, [setConfirmation]);
}
