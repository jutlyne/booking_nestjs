export interface AppConfig {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  port: number;
  apiPrefix: string;
  frontendUrl: string;
}

export interface DatabaseConfig {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
}

export interface AuthConfig {
  secret?: string;
  expires?: string;
  refreshSecret?: string;
  refreshExpires?: string;
}

export interface MailerConfig {
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
}

export interface RedisConfig {
  url: string;
  token: string;
}

export interface AllConfigType {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  mailer: MailerConfig;
  redis: RedisConfig;
}
