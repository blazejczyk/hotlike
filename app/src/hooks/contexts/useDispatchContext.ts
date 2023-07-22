import { useContext, useMemo } from 'react';

import DispatchContext, { TDispatch, getDispatchers } from '../../store/contexts/dispatch';

export default function useDispatchContext(): TDispatch {
  const dispatch = useContext(DispatchContext);
  return useMemo(() => getDispatchers(dispatch), [dispatch]);
};
