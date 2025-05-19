import { ConditionDomain } from '../condition.domain';
import { ConditionType } from '../condition.type';

export class ConsecutiveLoginConditionDomain extends ConditionDomain {
  type = ConditionType.CONSECUTIVE_LOGIN;
  params: { days: number };

  constructor(params: { days: number }) {
    super();
    this.validateParams(params);
    this.params = params;
  }

  private validateParams(params: { days: number }): void {
    if (
      !params ||
      typeof params.days !== 'number' ||
      !Number.isInteger(params.days) ||
      params.days < 1 ||
      params.days > 10000
    ) {
      throw new Error('params.days는 1~10000 사이의 정수여야 합니다.');
    }
  }

  // TODO:실제로는 유저의 출석 데이터와 비교해야 하게 다시 구현
  isSatisfied(userData: { consecutiveDays: number }): boolean {
    return userData.consecutiveDays >= this.params.days;
  }
}
