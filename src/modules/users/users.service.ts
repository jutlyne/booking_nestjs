import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from '@/common/constants/common';
import { GetUsersDto } from './dto/get-users.dto';

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

  async findAll(dto: GetUsersDto) {
    const { users, total } = await this.repo.findAll(dto);

    return {
      data: users,
      total,
      lastId: dto.lastId || 0,
      limit: dto.limit || 10,
    };
  }

  async deleteUser(id: number) {
    try {
      await this.repo.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw error;
    }
  }
}
