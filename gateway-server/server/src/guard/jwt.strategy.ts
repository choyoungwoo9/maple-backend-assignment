import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_SERVER_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload.exposedId || !payload.role) {
      throw new UnauthorizedException();
    }
    return {
      userId: payload.exposedId,
      role: payload.role,
    };
  }
}
