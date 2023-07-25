import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import config from './config';

export const defaultSender: string = `HotLike <${config.mail.sender}>`;

const transporter = nodemailer.createTransport({
  host: config.mail.transport.host,
  port: config.mail.transport.port,
  auth: {
    user: config.mail.transport.username,
    pass: config.mail.transport.password,
  },
  tls: {
    ciphers: 'SSLv3'
  },
  secure: config.mail.transport.port === 465,
});

export async function send(options: Mail.Options): Promise<void> {
  try {
    await transporter.sendMail(options);
  } catch (err) {
    // todo: this can be logged somewhere but it should not throw an exception
    console.log('Sending email failed.');
    console.log(err);
  }
}
