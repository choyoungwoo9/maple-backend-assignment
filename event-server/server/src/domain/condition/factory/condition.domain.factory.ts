import { ConditionType } from '../condition.type';
import { ConsecutiveLoginConditionDomain } from '../impl/consecutive-login.condition.domain';
import { ConditionDomain } from '../condition.domain';

export class ConditionDomainFactory {
  static create(type: string, params: Record<string, any>): ConditionDomain {
    switch (type) {
      case ConditionType.CONSECUTIVE_LOGIN:
        return new ConsecutiveLoginConditionDomain(params as any);
      // TODO: 다른 타입 추가
      default:
        throw new Error('지원하지 않는 조건 타입입니다.');
    }
  }
}
