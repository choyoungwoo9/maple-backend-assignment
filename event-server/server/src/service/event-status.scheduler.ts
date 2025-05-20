import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventRepository } from '../repository/event.repository';
import { EventStatus } from 'src/domain/event/event.domain';

//schedule 모듈에서 crypto를 찾지 못해서 추가
//TODO: 원인파악 후 수정
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto');
}

@Injectable()
export class EventStatusScheduler {
  private readonly logger = new Logger(EventStatusScheduler.name);

  constructor(private readonly eventRepository: EventRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async activateEvents() {
    const now = new Date();
    const eventsToActivate =
      await this.eventRepository.findInactiveAndOngoingEvents(now);

    for (const event of eventsToActivate) {
      await this.eventRepository.updateStatus(event.id, EventStatus.ACTIVE);
      this.logger.log(`이벤트 활성화: ${event.description}`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deactivateEvents() {
    const now = new Date();
    const eventsToDeactivate =
      await this.eventRepository.findActiveAndEndedEvents(now);
    for (const event of eventsToDeactivate) {
      await this.eventRepository.updateStatus(event.id, EventStatus.INACTIVE);
      this.logger.log(`이벤트 비활성화: ${event.description}`);
    }
  }
}
