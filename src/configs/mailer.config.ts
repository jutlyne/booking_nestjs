import { registerAs } from '@nestjs/config';
import { MailerConfig } from './config.interface';

export default registerAs<MailerConfig>('mailer', () => {
  return {
    port: process.env.MAILER_PORT ? parseInt(process.env.MAILER_PORT, 10) : 587,
    host: process.env.MAILER_HOST,
    user: process.env.MAILER_USER,
    password: process.env.MAILER_PASSWORD,
    defaultEmail: process.env.MAILER_DEFAULT_EMAIL,
    defaultName: process.env.MAILER_DEFAULT_NAME,
    ignoreTLS: process.env.MAILER_IGNORE_TLS === 'true',
    secure: process.env.MAILER_SECURE === 'true',
    requireTLS: process.env.MAILER_REQUIRE_TLS === 'true',
  };
});
