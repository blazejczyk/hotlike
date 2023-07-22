import { useCallback } from 'react';
import { uniqueId } from 'lodash';
import { EvaStatus } from '@ui-kitten/components/devsupport/typings';

import useDispatchContext from './contexts/useDispatchContext';

type TToastMethod = (content: string, status?: EvaStatus, onPress?: () => void) => void;

export default function useToast(): TToastMethod {
  const { addToast } = useDispatchContext();

  return useCallback<TToastMethod>((content, status = 'info', onPress) => {
    addToast({ id: uniqueId('toast_'), content, status, onPress });
  }, [addToast]);
}
