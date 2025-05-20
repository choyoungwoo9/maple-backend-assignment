import { ConditionDomain } from '../condition/condition.domain';
import { RewardDomain } from '../reward/reward.domain';
import { v4 as uuidv4 } from 'uuid';
export enum EventStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class EventDomain {
  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly status: EventStatus,
    public readonly conditionList: ConditionDomain[],
    public readonly rewardList: RewardDomain[],
  ) {}

  static create(params: {
    description: string;
    startAt: Date;
    endAt: Date;
    conditions: ConditionDomain[];
    rewards: RewardDomain[];
  }) {
    this.validateParams(params);
    const id = uuidv4();
    return new EventDomain(
      id,
      params.description,
      params.startAt,
      params.endAt,
      EventStatus.INACTIVE,
      params.conditions,
      params.rewards,
    );
  }

  static validateParams(params: {
    description: string;
    startAt: Date;
    endAt: Date;
    conditions: ConditionDomain[];
    rewards: RewardDomain[];
  }) {
    //TODO: Custom Exception 구현
    if (params.endAt < new Date()) {
      throw new Error('endAt은 과거일 수 없습니다.');
    }
    if (params.startAt > params.endAt) {
      throw new Error('startAt은 endAt보다 이전일 수 없습니다.');
    }
    if (params.conditions.length === 0) {
      throw new Error('conditionList는 최소 하나 이상 포함되어야 합니다.');
    }
  }
}
