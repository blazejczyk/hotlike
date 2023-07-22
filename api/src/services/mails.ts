import secondsToMinutes from 'date-fns/secondsToMinutes';

import { send, defaultSender } from '../core/mailing';
import { usersConstants } from './constants';

export function sendActivationCode(recipient: string, activationCode: string): Promise<void> {
  return send({
    from: defaultSender,
    to: recipient,
    subject: 'Activate your account in HotLike app',
    html: `
      Your activation code in HotLike app is: <b>${activationCode}</b>.<br />
      Please note this code is valid for ${secondsToMinutes(usersConstants.activationTime)} minutes only.
    `,
  });
}
