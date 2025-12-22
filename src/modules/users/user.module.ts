import { IsNotExist } from '@/common/utils/validators/is-not-exists.validator';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/databases/prisma.service';
import { Repository, Services } from '@/common/constants/common';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: Repository.USERS,
      useClass: UserRepository,
    },
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    PrismaService,
    IsNotExist,
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
