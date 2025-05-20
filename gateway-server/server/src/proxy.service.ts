import { Controller, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  async proxy(@Req() req: Request, @Res() res: Response, baseURL: string) {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    const response = await firstValueFrom(
      this.httpService.request({
        method: req.method,
        url: `${baseURL}${req.url}`,
        headers,
        data: req.body,
        params: req.query,
        validateStatus: () => true,
      }),
    );

    Object.entries(response.headers).forEach(([k, v]) => res.setHeader(k, v));
    res.status(response.status).json(response.data);
  }
}
