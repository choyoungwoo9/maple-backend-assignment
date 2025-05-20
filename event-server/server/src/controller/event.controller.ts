import { Body, Controller, Post } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { CreateEventRequestDto } from './dto/create-event.request.dto';

@Controller('/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  createEvent(@Body() dto: CreateEventRequestDto) {
    return this.eventService.createEvent(dto);
  }
}
