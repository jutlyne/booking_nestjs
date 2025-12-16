import { Exclude } from 'class-transformer';
import { Role } from '@prisma/client';

export class UserEntity {
  id: number;
  email: string;

  @Exclude()
  password: string;

  role: Role;
  fullname?: string;
  phone?: number;
  avatar?: string;
  teamId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
