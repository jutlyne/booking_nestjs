import { UserModule } from './modules/users/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './common/configs/app.config';
import authConfig from './common/configs/auth.config';
import databaseConfig from './common/configs/database.config';

import { ClsModule } from 'nestjs-cls';
import { randomUUID } from 'crypto';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppLogger } from './common/utils/logger';
import { Request } from 'express';
import { AuthModule } from './modules/auth/auth.module';
import { RoomBookingModule } from './modules/room-bookings/room-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfig, authConfig, databaseConfig],
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
    UserModule,
    AuthModule,
    RoomBookingModule,
  ],
  providers: [AppLogger],
})
export class AppModule {}
