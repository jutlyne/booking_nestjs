import { IsNotExist } from '@/common/utils/validators/is-not-exists.validator';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PrismaService } from 'src/databases/prisma.service';
import { Repository, Services } from '@/common/constants/common';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: Repository.USERS,
      useClass: UsersRepository,
    },
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
    PrismaService,
    IsNotExist,
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
