import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  UseGuards,
  Query,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Routes, Services } from '@/common/constants/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { GetUsersDto } from './dto/get-users.dto';
import { Permission } from '@/common/permissions/permission.enum';
import { Permissions } from '@/common/permissions/permissions.decorator';
import { RedisPermissionGuard } from '@/common/permissions/redis-role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPermissionService } from '@/common/permissions/redis-permissions';

@Controller(Routes.USERS)
@UseGuards(JwtAuthGuard, RedisPermissionGuard)
export class UserController {
  constructor(
    @Inject(Services.USERS) private readonly service: UserService,
    private readonly userPermissionService: UserPermissionService,
  ) {}

  @Get()
  @Permissions(Permission.USER_READ)
  getUsers(@Query() dto: GetUsersDto) {
    return this.service.findAll(dto);
  }

  @Post()
  @Permissions(Permission.USER_CREATE)
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  @Permissions(Permission.USER_READ)
  findOne(@Param('id') id: string) {
    return this.service.findById(Number(id));
  }

  @Patch(':id')
  @Permissions(Permission.USER_UPDATE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.service.updateUser(id, dto);

    if (dto.role) {
      await this.userPermissionService.setUserPermissions(id, dto.role);
    }

    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.deleteUser(id);

    await this.userPermissionService.removeUserPermissions(id);

    return result;
  }
}
