import { UserEntity } from '@/users/entities/user.entity';

export interface JwtPayloadInterface extends Pick<UserEntity, 'id'> {
  iat: number;
  exp: number;
}
