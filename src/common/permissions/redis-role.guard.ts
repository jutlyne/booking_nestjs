import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UserPermissionService } from './redis-permissions';
import { Permission } from './permission.enum';
import { User } from '@prisma/client';
import { Repository } from '../constants/common';
import { UserRepository } from '@/modules/users/user.repository';

@Injectable()
export class RedisPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userPermissionService: UserPermissionService,
    @Inject(Repository.USERS) private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const userId = (req.user as User)?.id;

    if (!userId) throw new ForbiddenException('User not authenticated');

    const redisData =
      await this.userPermissionService.getUserPermissions(userId);
    if (!redisData) throw new ForbiddenException('Permissions not found');

    const { role, permissions } = redisData;

    const hasPermission = requiredPermissions.every((p) =>
      permissions.includes(p),
    );

    if (!hasPermission) throw new ForbiddenException();

    const targetId = Number(req.params?.id);

    if (requiredPermissions.includes(Permission.USER_UPDATE) && targetId) {
      if (role === 'super_admin' || targetId == userId) {
        return true;
      } else if (role === 'admin') {
        const targetUser = await this.userRepository.findById(targetId);
        const targetRole: string = targetUser?.role || 'user';

        if (targetRole === 'user') {
          return true;
        } else {
          throw new ForbiddenException('Admin cannot edit this user');
        }
      } else {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    req.user = {
      ...(req.user as User),
      role,
      permissions,
    };

    return true;
  }
}
