import { RewardType } from './reward.type';

export interface RewardDomain {
  type: RewardType;
  amount: number;
  description: string;
  id?: string;
}
