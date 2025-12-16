import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.interface';

export default registerAs<DatabaseConfig>('databases', () => {
  return {
    url: process.env.DATABASE_URL,
  };
});
