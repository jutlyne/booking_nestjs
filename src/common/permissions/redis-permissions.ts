import { Inject, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Permission } from './permission.enum';
import { ROLE_PERMISSIONS } from './role-permission.map';
import { RedisService } from '../redis/redis.service';
import { Services } from '../constants/common';

@Injectable()
export class UserPermissionService {
  constructor(
    @Inject(Services.REDIS) private readonly redisService: RedisService,
  ) {}

  async setUserPermissions(userId: number, role: Role) {
    await this.redisService.set(`user:${userId}`, {
      role,
      permissions: ROLE_PERMISSIONS[role] || [],
    });
  }

  async getUserPermissions(userId: number) {
    return this.redisService.get<{ role: Role; permissions: Permission[] }>(
      `user:${userId}`,
    );
  }

  async removeUserPermissions(userId: number) {
    await this.redisService.del(`user:${userId}`);
  }
}
