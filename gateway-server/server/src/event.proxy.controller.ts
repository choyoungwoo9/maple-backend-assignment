import {
  All,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { Role } from './guard/role.enum';
import { Roles } from './guard/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Operator)
  async createEvent(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      await this.proxyService.proxy(req, res, process.env.EVENT_SERVER_URL);
    } catch (e) {
      console.error('이벤트 프록시 통신 오류:', e?.message);
      throw new InternalServerErrorException();
    }
  }

  @All('*')
  async proxyOtherRequests(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.proxyService.proxy(req, res, process.env.EVENT_SERVER_URL);
    } catch (e) {
      console.error('이벤트 프록시 통신 오류:', e?.message);
      throw new InternalServerErrorException();
    }
  }
}
