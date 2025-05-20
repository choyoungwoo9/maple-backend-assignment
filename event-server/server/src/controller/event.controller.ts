import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { EventService } from '../service/event.service';
import { CreateEventRequestDto } from './dto/create-event.request.dto';
import { AuthService } from 'src/service/auth/auth.service';
import { Role } from 'src/service/auth/role.enum';

@Controller('/event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createEvent(
    @Body() dto: CreateEventRequestDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = this.parseToken(authHeader);
    const authPayload = await this.authService.verifyToken(token);
    return this.eventService.createEvent(dto, authPayload);
  }

  private parseToken(authHeader: string): string {
    try {
      return authHeader?.split(' ')[1];
    } catch (error) {
      throw new UnauthorizedException('Authorization 헤더 형식 오류');
    }
  }
}
