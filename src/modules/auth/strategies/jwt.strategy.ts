import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/common/configs/config.interface';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { OrNeverType } from '@/common/utils/interfaces/or-never.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('auth.secret', {
        infer: true,
      }),
    });
  }

  public validate(
    payload: JwtPayloadInterface,
  ): OrNeverType<JwtPayloadInterface> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
