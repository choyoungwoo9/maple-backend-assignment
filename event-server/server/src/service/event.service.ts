import { Injectable } from '@nestjs/common';
import { CreateEventRequestDto } from 'src/controller/dto/create-event.request.dto';
import { RewardDomainFactory } from 'src/domain/reward/factory/reward.domain.factory';
import { ConditionDomainFactory } from 'src/domain/condition/factory/condition.domain.factory';
import { EventDomain } from 'src/domain/event/event.domain';
import { EventRepository } from 'src/repository/event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}
  createEvent(dto: CreateEventRequestDto) {
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
    });
    return this.eventRepository.create(event);
  }

  //TODO: 이벤트에 보상 추가
  //TODO: 이벤트 조회
  //TODO: 이벤트에 대한 보상 요청(유저)
  //TODO: 특정 유저 보상 이력 조회
  //TODO: 전체 보상 이력 조회
  //TODO: 이벤트 활성화 비활성화
}
