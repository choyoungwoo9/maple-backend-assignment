import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateEventRequestDto } from 'src/controller/dto/create-event.request.dto';
import { RewardDomainFactory } from 'src/domain/reward/factory/reward.domain.factory';
import { ConditionDomainFactory } from 'src/domain/condition/factory/condition.domain.factory';
import { EventDomain } from 'src/domain/event/event.domain';
import { EventRepository } from 'src/repository/event.repository';
import { Role } from './auth/role.enum';
import { AuthPayload } from './auth/auth.service';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}
  createEvent(dto: CreateEventRequestDto, authPayload: AuthPayload) {
    if (authPayload.role !== Role.Admin && authPayload.role !== Role.Operator) {
      throw new Error('권한 없음');
    }
    const conditions = dto.event.conditions.map((condition) =>
      ConditionDomainFactory.create(condition.type, condition.params),
    );
    const rewards = dto.rewards.map((reward) =>
      RewardDomainFactory.create(
        reward.type,
        reward.amount,
        reward.description,
        reward.id,
      ),
    );
    const event = EventDomain.create({
      description: dto.event.description,
      startAt: dto.event.startAt,
      endAt: dto.event.endAt,
      conditions: conditions,
      rewards: rewards,
      creatorExposedId: authPayload.exposedId,
    });
    return this.eventRepository.create(event);
  }

  async getEventListSummary() {
    return this.eventRepository.findAllSummary();
  }

  async getEventById(id: string) {
    return this.eventRepository.findById(id);
  }

  //TODO: 이벤트에 대한 보상 요청(유저)
  //TODO: 본인 보상 이력 조회
  //TODO: 전체 보상 이력 조회
}
