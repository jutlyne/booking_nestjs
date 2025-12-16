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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Services } from '@/common/constants/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/roles/roles.guard';
import { Roles } from '@/common/roles/roles.decorator';
import { Role } from '@prisma/client';
import { GetUsersDto } from './dto/get-users.dto';
import { ForbiddenException } from '@/common/exceptions/forbidden.exception';
import { Request } from 'express';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(Services.USERS) private readonly service: UsersService) {}

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
