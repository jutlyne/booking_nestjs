import { UserEntity } from '@/modules/users/entities/user.entity';

export type LoginResponseInterface = Readonly<{
  token?: string;
  refreshToken?: string;
  tokenExpires?: number;
  user: UserEntity;
}>;
