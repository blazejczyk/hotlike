import { useCallback, useEffect, useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from '@ui-kitten/components';
import { EvaStatus } from '@ui-kitten/components/devsupport/typings';

import useStateContext from '../hooks/contexts/useStateContext';
import useDispatchContext from '../hooks/contexts/useDispatchContext';
import { toastVisibilityTime } from '../services/constants';

export type TToast = {
  id: string;
  content: string;
  status: EvaStatus;
  onPress?: () => void;
};

export default function Toasts(): JSX.Element {
  const { toasts } = useStateContext();

  return (
    <SafeAreaView style={styles.toasts}>
      {toasts.map((toast) => <Toast key={toast.id} toast={toast} />)}
    </SafeAreaView>
  );
}

type TToastProps = {
  toast: TToast;
};

function Toast({ toast }: TToastProps): JSX.Element {
  const { id, content, status, onPress } = toast;
  const { removeToast } = useDispatchContext();
  const theme = useTheme();

  const containerStyle = useMemo(() => [
    styles.toast,
    {
      backgroundColor: theme[`color-${status}-200`],
      borderColor: theme[`color-${status}-400`],
    }
  ], [theme, status]);

  const textStyle = useMemo(() => ({ color: theme[`color-${status}-600`] }), [theme, status]);

  const disappear = useCallback(() => {
    removeToast(id);
  }, [removeToast, id]);

  const handlePress = useCallback(() => {
    disappear();
    if (onPress) {
      onPress();
    }
  }, [disappear, onPress]);

  useEffect(() => {
    const timeoutId = setTimeout(disappear, toastVisibilityTime);
    return () => clearTimeout(timeoutId);
  }, [disappear]);

  return (
    <TouchableOpacity style={containerStyle} onPress={handlePress}>
      <Text style={textStyle}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toasts: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  toast: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
});
