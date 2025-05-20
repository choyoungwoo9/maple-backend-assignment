import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AuthPayload {
  exposedId: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<AuthPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.AUTH_SERVER_JWT_SECRET,
        algorithms: ['HS256'],
      });
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰');
    }
  }
}
