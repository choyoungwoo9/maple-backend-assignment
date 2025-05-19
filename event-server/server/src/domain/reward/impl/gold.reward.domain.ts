import { RewardDomain } from '../reward.domain';
import { RewardType } from '../reward.type';

export class GoldRewardDomain extends RewardDomain {
  type = RewardType.GOLD;
  amount: number;
  description: string;
  id?: string;
  constructor(params: { amount: number; description: string }) {
    super();
    this.validateParams(params);
    this.amount = params.amount;
    this.description = params.description;
  }

  private validateParams(params: { amount: number; description: string }) {
    if (
      typeof params.amount !== 'number' ||
      !Number.isInteger(params.amount) ||
      params.amount < 1 ||
      params.amount > 1000000
    ) {
      throw new Error('amount는 1~1000000 사이의 정수여야 합니다.');
    }
    if (!params.description || typeof params.description !== 'string') {
      throw new Error('description은 필수 문자열입니다.');
    }
  }
}
