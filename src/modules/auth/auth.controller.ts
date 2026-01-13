import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Routes, Services } from '@/common/constants/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailLoginDto } from './dtos/email-login.dto';
import { LoginResponseInterface } from './interfaces/login-response.interface';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response.interceptor';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { setCookies } from '@/common/utils/helpers';
import { AuthService } from './auth.service';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@ApiTags('Auth')
@Controller(Routes.AUTH)
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: EmailLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseInterface<LoginResponseInterface>> {
    const { token, refreshToken, tokenExpires, user } =
      await this.authService.userLogin(loginDto);

    setCookies(res, 'token', String(token), tokenExpires);
    setCookies(res, 'refreshToken', String(refreshToken), tokenExpires);

    return { data: { user } };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, refreshToken, tokenExpires } =
      await this.authService.refreshTokens(body.refreshToken);

    setCookies(res, 'token', String(token), tokenExpires);
    setCookies(res, 'refreshToken', String(refreshToken), tokenExpires);

    return {
      data: {
        token,
        refreshToken,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: Request) {
    const userId = (request.user as UserEntity)?.id;
    return this.authService.getProfile(userId);
  }
}
