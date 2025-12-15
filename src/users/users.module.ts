import { IsNotExist } from '@/utils/validators/is-not-exists.validator';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Repository, Services } from '../constants/common';
import { UsersRepository } from './users.repository';
import { PrismaService } from 'src/databases/prisma.service';

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
