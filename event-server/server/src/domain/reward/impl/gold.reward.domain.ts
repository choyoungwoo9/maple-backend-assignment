import { RewardDomain } from '../reward.domain';
import { RewardType } from '../reward.type';

export class GoldRewardDomain extends RewardDomain {
  type = RewardType.GOLD;
  amount: number;
  description: string;
  id?: string;
  constructor(amount: number, description: string, id: string) {
    super();
    this.validateParams(amount, description, id);
    this.amount = amount;
    this.description = description;
  }

  private validateParams(amount: number, description: string, id?: string) {
    if (
      typeof amount !== 'number' ||
      !Number.isInteger(amount) ||
      amount < 1 ||
      amount > 1000000
    ) {
      throw new Error('amount는 1~1000000 사이의 정수여야 합니다.');
    }
    if (!description || typeof description !== 'string') {
      throw new Error('description은 필수 문자열입니다.');
    }
    if (id) {
      throw new Error('id는 입력하면 안 됩니다.');
    }
  }
}
