import { useRef, useCallback, useEffect } from 'react';

export default function useReadyLayout(callback: () => void): () => void {
  const readyRef = useRef<boolean>(false);
  const callbackRef = useRef<() => void>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(() => {
    if (!readyRef.current) {
      callbackRef.current();
      readyRef.current = true;
    }
  }, []);
}
