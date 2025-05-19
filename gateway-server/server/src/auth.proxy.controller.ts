import {
  All,
  Controller,
  InternalServerErrorException,
  Req,
  Res,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AuthProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All('auth/*')
  async proxyAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;
    const method = req.method;
    const path = req.url;
    const url = `${AUTH_SERVER_URL}${path}`;

    try {
      const headers = { ...req.headers };

      // axios가 자동으로 채움
      delete headers['host'];
      delete headers['content-length'];

      const config = {
        method,
        url,
        headers,
        data: req.body,
        params: req.query,
        validateStatus: () => true,
      };

      const response = await firstValueFrom(this.httpService.request(config));
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('인증 프록시 통신 오류:', error.message);
      throw new InternalServerErrorException();
    }
  }
}
