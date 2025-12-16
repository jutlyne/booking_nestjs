import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from '@/common/constants/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Repository.USERS) private readonly repo: UsersRepository,
  ) {}

  create(dto: CreateUserDto): Promise<UserEntity> {
    return this.repo.create(dto);
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
