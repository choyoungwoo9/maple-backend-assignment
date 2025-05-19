import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from './auth.proxy.controller';
import { GatewayController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AuthProxyController, GatewayController],
  providers: [],
})
export class GatewayModule {}
