import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.interface';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export default registerAs<AppConfig>('app', () => {
  const appPort = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3000;

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    port: appPort,
    apiPrefix: process.env.API_PREFIX || 'api',
    frontendUrl: process.env.FRONT_END_URL || '*',
  };
});
