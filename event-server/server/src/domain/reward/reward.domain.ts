import { RewardType } from './reward.type';
import { GoldRewardDomain } from './impl/gold.reward.domain';

export abstract class RewardDomain {
  abstract type: RewardType;
  abstract amount: number;
  abstract description: string;
  abstract id?: string;

  static create(type: RewardType, params: Record<string, any>): RewardDomain {
    switch (type) {
      case RewardType.GOLD:
        return new GoldRewardDomain(params as any);
      //TODO: 다른 보상 타입 추가
      default:
        throw new Error('지원하지 않는 보상 타입');
    }
  }
}
