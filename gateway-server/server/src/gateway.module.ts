import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from './auth.proxy.controller';
import { ProxyService } from './proxy.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/jwt.strategy';
import { EventProxyController } from './event.proxy.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_SERVER_JWT_SECRET,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AuthProxyController, EventProxyController],
  providers: [ProxyService, JwtStrategy],
})
export class GatewayModule {}
