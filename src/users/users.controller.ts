import { Controller, Post, Body, Get, Param, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Services } from 'src/constants/common';

@Controller('users')
export class UsersController {
  constructor(@Inject(Services.USERS) private readonly service: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(Number(id));
  }
}
