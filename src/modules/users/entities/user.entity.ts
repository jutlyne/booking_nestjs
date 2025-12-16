import { Exclude } from 'class-transformer';
import { Role } from '@prisma/client';
import { BaseEntity } from '@/common/entities/base.entity';

export class UserEntity extends BaseEntity {
  email: string;

  @Exclude()
  password: string;

  role: Role;
  fullname?: string;
  phone?: number;
  avatar?: string;
  teamId?: number;

  constructor(partial: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
