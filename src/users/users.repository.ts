import { Injectable } from '@nestjs/common';
import { PrismaService } from '../databases/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    console.log(data);

    const user = await this.prisma.user.create({
      data,
    });

    return new UserEntity(
      user.id,
      user.email,
      user.password,
      user.fullname ?? undefined,
      user.phone ?? undefined,
      user.avatar ?? undefined,
      user.teamId ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.email,
      user.password,
      user.fullname ?? undefined,
      user.phone ?? undefined,
      user.avatar ?? undefined,
      user.teamId ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.email,
      user.password,
      user.fullname ?? undefined,
      user.phone ?? undefined,
      user.avatar ?? undefined,
      user.teamId ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }
}
