import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { hashPassword } from '@/common/utils/helpers';
import { PrismaService } from '@/databases/prisma.service';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UserRepository {
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

  async findAll(dto: GetUsersDto) {
    const { teamId, email, name, lastId = 0, limit = 10 } = dto;

    const where: any = {};
    if (teamId) where.teamId = teamId;
    if (email) where.email = { contains: email };
    if (name) where.fullname = { contains: name };

    const total = await this.prisma.user.count({ where });

    where.id = { gt: lastId };

    const users = await this.prisma.user.findMany({
      where,
      take: limit,
      orderBy: { id: 'asc' },
    });

    return { users: users.map((user) => new UserEntity(user)), total };
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
