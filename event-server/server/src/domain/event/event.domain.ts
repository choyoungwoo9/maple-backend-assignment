import { ConditionDomain } from '../condition/condition.domain';
import { RewardDomain } from '../reward/reward.domain';

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class EventDomain {
  constructor(
    public readonly description: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly status: EventStatus,
    public readonly conditionList: ConditionDomain[],
    public readonly rewardList: RewardDomain[],
  ) {}

  create(params: {
    description: string;
    startAt: Date;
    endAt: Date;
    conditionList: ConditionDomain[];
    rewardList: RewardDomain[];
  }) {
    this.validateParams(params);
    return new EventDomain(
      params.description,
      params.startAt,
      params.endAt,
      EventStatus.INACTIVE,
      params.conditionList,
      params.rewardList,
    );
  }

  private validateParams(params: {
    description: string;
    startAt: Date;
    endAt: Date;
    conditionList: ConditionDomain[];
    rewardList: RewardDomain[];
  }) {
    //TODO: Custom Exception 구현
    if (params.endAt < new Date()) {
      throw new Error('endAt은 과거일 수 없습니다.');
    }
    if (params.startAt > params.endAt) {
      throw new Error('startAt은 endAt보다 이전일 수 없습니다.');
    }
    if (params.conditionList.length === 0) {
      throw new Error('conditionList는 최소 하나 이상 포함되어야 합니다.');
    }
  }
}
