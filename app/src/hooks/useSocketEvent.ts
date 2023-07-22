import { useEffect, useRef } from 'react';

import socket, { SocketEvent } from '../core/io';

export default function useSocketEvent<TData>(name: SocketEvent, listener: (data: TData) => void) {
  const listenerRef = useRef<(data: TData) => void>(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    socket.on(name, listenerRef.current);
    return () => {
      socket.off(name, listenerRef.current);
    };
  }, [name]);
}
