import { useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import useInterval from '../hooks/useInterval';

type TTimeDistanceProps = {
  time: Date | string;
};

const intervalDelay = 60000; // ms

export default function TimeDistance({ time }: TTimeDistanceProps): JSX.Element {
  const [timeDistance, setTimeDistance] = useState(formatDistanceToNow(new Date(time)));

  useInterval(() => {
    setTimeDistance(formatDistanceToNow(new Date(time)));
  }, intervalDelay);

  return <>{timeDistance}</>
}
