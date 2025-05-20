import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { EventService } from '../service/event.service';
import { CreateEventRequestDto } from './dto/create-event.request.dto';
import { AuthService } from 'src/service/auth/auth.service';

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

  @Get('summary')
  async getEventListSummary() {
    return this.eventService.getEventListSummary();
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    const event = await this.eventService.getEventById(id);
    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }
    return event;
  }

  private parseToken(authHeader: string): string {
    try {
      return authHeader?.split(' ')[1];
    } catch (error) {
      throw new UnauthorizedException('Authorization 헤더 형식 오류');
    }
  }
}
