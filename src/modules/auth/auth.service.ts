import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EmailLoginDto } from './dtos/email-login.dto';
import { LoginResponseInterface } from './interfaces/login-response.interface';
import { Services } from '@/common/constants/common';
import { compareHash } from '@/common/utils/helpers';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/common/configs/config.interface';
import ms from 'ms';
import { UserService } from '@/modules/users/user.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Services.USERS) private readonly usersService: UserService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
  ) {}

  async userLogin(loginDto: EmailLoginDto): Promise<LoginResponseInterface> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await compareHash(loginDto.password, user.password);
    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
      user,
    };
  }

  async getProfile(
    id?: number,
  ): Promise<ResponseInterface<UserEntity | object>> {
    if (!id)
      return {
        data: {},
      };

    const data = await this.usersService.findById(id);

    return {
      data,
    };
  }

  private async getTokensData(data: { id: number; role: string }) {
    const tokenExpiresIn = this.configService.getOrThrow<string>(
      'auth.expires',
      {
        infer: true,
      },
    ) as unknown as number;
    const tokenExpires = (Date.now() + ms(tokenExpiresIn)) as unknown as number;
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow<string>('auth.secret', {
            infer: true,
          }),
          expiresIn: tokenExpiresIn,
        },
      ),

      await this.jwtService.signAsync(
        {
          sessionId: data.id as string | number,
        },
        {
          secret: this.configService.getOrThrow<string>('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow<string>(
            'auth.refreshExpires',
            {
              infer: true,
            },
          ),
        } as JwtSignOptions,
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
