import { RewardType } from './reward.type';

export abstract class RewardDomain {
  abstract type: RewardType;
  abstract amount: number;
  abstract description: string;
  abstract id?: string;
}
