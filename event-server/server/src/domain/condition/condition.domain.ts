import { ConditionType } from './condition.type';

export abstract class ConditionDomain {
  abstract type: ConditionType;
  abstract params: Record<string, any>;

  constructor() {}

  abstract isSatisfied(params: Record<string, any>): boolean;
}
