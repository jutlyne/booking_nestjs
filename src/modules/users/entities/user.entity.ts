import { Exclude, Expose } from 'class-transformer';
import { Role } from '@prisma/client';
import { BaseEntity } from '@/common/entities/base.entity';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export class UserEntity extends BaseEntity {
  email: string;

  @Exclude()
  password: string;

  role: Role;
  name?: string | null;
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

  @Expose()
  get avatarUrl(): string | null {
    if (!this.avatar) return null;
    return `${BACKEND_URL}${this.avatar.startsWith('/') ? '' : '/'}${this.avatar}`;
  }
}
