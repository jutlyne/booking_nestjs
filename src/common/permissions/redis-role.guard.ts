import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UserPermissionService } from './redis-permissions';
import { Permission } from './permission.enum';
import { User } from '@prisma/client';

@Injectable()
export class RedisPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userPermissionService: UserPermissionService,
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
    if (
      targetId &&
      requiredPermissions.includes(Permission.USER_UPDATE) &&
      role !== 'super_admin' &&
      userId !== targetId
    ) {
      throw new ForbiddenException();
    }

    req.user = {
      ...(req.user as User),
      role,
      permissions,
    };

    return true;
  }
}
