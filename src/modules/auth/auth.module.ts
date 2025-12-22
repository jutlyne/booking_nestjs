import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from '@/common/constants/common';
import { IsExist } from '@/common/utils/validators/is-exists.validator';
import { IsNotExist } from '@/common/utils/validators/is-not-exists.validator';
import { UserModule } from '@/modules/users/user.module';
import { AppLogger } from '@/common/utils/logger';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@/databases/prisma.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    IsExist,
    IsNotExist,
    AppLogger,
    JwtStrategy,
    PrismaService,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
