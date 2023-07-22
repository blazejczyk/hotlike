import { useEffect, useRef } from 'react';

export default function usePrevious<TValue>(value: TValue, callback: (previousValue: TValue, nextValue: TValue) => void): void {
  const valueRef = useRef(value);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    callbackRef.current(valueRef.current, value);
    valueRef.current = value;
  }, [value]);
}
