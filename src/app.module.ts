import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './configs/app.config';

import { ClsModule } from 'nestjs-cls';
import { randomUUID } from 'crypto';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppLogger } from './utils/logger';
import authConfig from './configs/auth.config';
import { Request } from 'express';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfig, authConfig],
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) =>
          (req.headers['x-request-id'] as string) ?? randomUUID(),
      },
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        // https://github.com/winstonjs/winston/issues/1392#issuecomment-689361987
        winston.format.combine(winston.format.errors({ stack: true })),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/info.log',
          level: 'info',
        }),
      ],
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [AppLogger],
})
export class AppModule {}
