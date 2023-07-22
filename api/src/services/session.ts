import { verify, sign, JwtPayload } from 'jsonwebtoken';
import { isString } from 'lodash';

import config from '../core/config';

export type TSession = {
  userId: string; // logged user id
  authedAt: string;
  // ... some other session properties ...
};

function isSession(payload: JwtPayload): payload is TSession {
  return ('userId' in payload) && ('authedAt' in payload);
}

export function getSession(token: string): TSession | null {
  try {
    const payload = verify(token, config.session.secret);
    return (isString(payload) || !isSession(payload)) ? null : payload as TSession;
  } catch (err) {
    return null;
  }
}

export function getToken(userId: string, authedAt: Date) {
  const payload: TSession = { userId, authedAt: authedAt.toISOString() };
  return sign(payload, config.session.secret, { noTimestamp: true });
}
