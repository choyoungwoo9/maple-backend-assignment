import {
  All,
  Controller,
  InternalServerErrorException,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly proxyService: ProxyService) {}
  @All('*')
  async proxyAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      await this.proxyService.proxy(req, res, process.env.AUTH_SERVER_URL);
    } catch (e) {
      console.error('인증 프록시 통신 오류:', e?.message);
      throw new InternalServerErrorException();
    }
  }
}
