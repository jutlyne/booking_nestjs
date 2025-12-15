import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.interface';

export default registerAs<AuthConfig>('auth', () => {
  return {
    secret: process.env.AUTH_JWT_SECRET || '123',
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  };
});
