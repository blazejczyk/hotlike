import { useEffect, useMemo, useState } from 'react';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import useInterval from '../hooks/useInterval';

type TCountdown = {
  initialTime: Date | string;
  render?: (remainingSeconds: number) => JSX.Element;
};

const intervalDelay = 50; // ms

export default function Countdown({ initialTime, render }: TCountdown): JSX.Element {
  const initialSeconds = useMemo(() => differenceInSeconds(new Date(initialTime), new Date()), [initialTime]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);

  const stopInterval = useInterval(() => {
    setRemainingSeconds(differenceInSeconds(new Date(initialTime), new Date()));
  }, intervalDelay);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      stopInterval();
    }
  }, [remainingSeconds, stopInterval]);

  return render ? render(remainingSeconds) : <>{remainingSeconds}</>;
}
