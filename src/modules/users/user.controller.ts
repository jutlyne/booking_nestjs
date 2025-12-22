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
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Routes, Services } from '@/common/constants/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/roles/roles.guard';
import { Roles } from '@/common/roles/roles.decorator';
import { Role } from '@prisma/client';
import { GetUsersDto } from './dto/get-users.dto';
import { ForbiddenException } from '@/common/exceptions/forbidden.exception';
import { Request } from 'express';
import { UserEntity } from './entities/user.entity';

@Controller(Routes.USERS)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(@Inject(Services.USERS) private readonly service: UserService) {}

  @Get()
  getUsers(@Query() dto: GetUsersDto) {
    return this.service.findAll(dto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(Number(id));
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if ((req?.user as UserEntity).id === id) {
      throw new ForbiddenException();
    }

    return this.service.deleteUser(id);
  }
}
