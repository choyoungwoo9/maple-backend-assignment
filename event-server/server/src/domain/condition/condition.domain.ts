import { ConditionType } from './condition.type';
import { ConsecutiveLoginConditionDomain } from '../condition/impl/consecutive-login.condition.domain';

export abstract class ConditionDomain {
  abstract type: ConditionType;
  abstract params: Record<string, any>;

  static create(
    type: ConditionType,
    params: Record<string, any>,
  ): ConditionDomain {
    switch (type) {
      case ConditionType.CONSECUTIVE_LOGIN:
        return new ConsecutiveLoginConditionDomain(params as any);
      // TODO: 다른 타입 추가
      default:
        throw new Error('지원하지 않는 조건 타입입니다.');
    }
  }

  abstract isSatisfied(params: Record<string, any>): boolean;
}
