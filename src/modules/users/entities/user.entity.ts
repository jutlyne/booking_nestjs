import { Exclude } from 'class-transformer';
import { Role } from '@prisma/client';
import { BaseEntity } from '@/common/entities/base.entity';

export class UserEntity extends BaseEntity {
  email: string;

  @Exclude()
  password: string;

  role: Role;
  fullname?: string | null;
  phone?: string | null;
  avatar?: string | null;
  teamId?: number | null;

  passwordResetPin?: number | null;
  passwordResetSentAt?: Date | null;

  constructor(partial: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
