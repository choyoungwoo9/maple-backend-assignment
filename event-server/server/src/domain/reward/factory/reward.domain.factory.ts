import { RewardType } from '../reward.type';
import { GoldRewardDomain } from '../impl/gold.reward.domain';
import { RewardDomain } from '../reward.domain';

export class RewardDomainFactory {
  static create(
    type: string,
    amount: number,
    description: string,
    id?: string,
  ): RewardDomain {
    switch (type) {
      case RewardType.GOLD:
        return new GoldRewardDomain(amount, description, id);
      // TODO: 다른 보상 타입 추가
      default:
        throw new Error('지원하지 않는 보상 타입');
    }
  }
}
