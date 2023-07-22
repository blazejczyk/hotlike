import { useEffect, useRef, useCallback } from 'react';

export default function useInterval(callback: () => void, delay: number): () => void {
  const intervalId = useRef<NodeJS.Timer | undefined>(undefined);
  const callbackRef = useRef<() => void>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      callbackRef.current();
    }, delay);
    return () => clearInterval(intervalId.current);
  }, [delay]);

  return useCallback(() => clearInterval(intervalId.current), []);
}
