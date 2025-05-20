import { ConditionType } from './condition.type';

export interface ConditionDomain {
  type: ConditionType;
  params: Record<string, any>;
  isSatisfied(params: Record<string, any>): boolean;
}
