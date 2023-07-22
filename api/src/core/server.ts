import http from 'http';
import { isString, get } from 'lodash';
import { Server as IO } from 'socket.io';

import app from './app';
import config from './config';
import { getSession } from '../services/session';

const server = http.createServer(app);
server.listen(config.app.port);
server.on('listening', () => {
  const addr = server.address();
  if (addr && !isString(addr)) {
    console.log(`Listening on port ${addr.port}.`);
  }
});

export const io = new IO(server);
io.on('connection', (socket) => {
  const token: string | undefined = get(socket.handshake.auth, 'token');
  if (!token) {
    return;
  }
  const session = getSession(token);
  if (!session) {
    return;
  }
  socket.join(session.userId);
  // socket.on('disconnect', () => {
  //   console.log('User disconnected.');
  // });
});
