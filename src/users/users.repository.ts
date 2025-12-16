import { Injectable } from '@nestjs/common';
import { PrismaService } from '../databases/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { hashPassword } from '@/utils/helpers';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      fullname: user.fullname ?? undefined,
      phone: user.phone ?? undefined,
      avatar: user.avatar ?? undefined,
      teamId: user.teamId ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) return null;

    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      fullname: user.fullname ?? undefined,
      phone: user.phone ?? undefined,
      avatar: user.avatar ?? undefined,
      teamId: user.teamId ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) return null;

    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      fullname: user.fullname ?? undefined,
      phone: user.phone ?? undefined,
      avatar: user.avatar ?? undefined,
      teamId: user.teamId ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
