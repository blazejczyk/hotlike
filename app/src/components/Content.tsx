import { useEffect } from 'react';

import PublicScopeNavigator from '../navigators/PublicScopeNavigator';
import RestrictedScopeNavigator from '../navigators/RestrictedScopeNavigator';
import Toasts from './Toasts';
import Confirmation from './Confirmation';
import Loading from './Loading';
import LoadingError from './LoadingError';
import useTokenLoader from '../hooks/loaders/useTokenLoader';
import socket from '../core/io';

export default function Content(): JSX.Element {
  const { loading: loadingToken, result: token, ready: tokenReady, error: loadingTokenError, load: reloadToken } = useTokenLoader();

  useEffect(() => {
    if (token && socket.disconnected) {
      socket.auth = { token };
      socket.connect();
    } else if (!token && socket.connected) {
      socket.auth = {};
      socket.disconnect();
    }
  }, [token]);

  if (loadingToken) {
    return <Loading />;
  }

  if (loadingTokenError) {
    return <LoadingError onReload={reloadToken} />
  }

  return (
    <>
      {tokenReady && (
        token
          ? <RestrictedScopeNavigator />
          : <PublicScopeNavigator />
      )}
      <Toasts />
      <Confirmation />
    </>
  );
}
