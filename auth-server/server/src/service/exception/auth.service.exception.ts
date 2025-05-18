import { AuthException } from 'src/common/exception/auth.exception';

export class AuthServiceException extends AuthException {
	constructor({ message, cause }: { message: string; cause?: Error }) {
		super({ message, cause });
	}
}

export class AuthServiceUnexpectedException extends AuthServiceException {
	constructor({
		message = '인증 서비스에서 예상치 못한 오류가 발생했습니다.',
		cause,
	}: {
		message?: string;
		cause?: Error;
	}) {
		super({ message, cause });
	}
}

export class AuthServiceIdDuplicatedException extends AuthServiceException {
	constructor({
		message = '이미 존재하는 아이디입니다.',
		cause,
	}: {
		message?: string;
		cause?: Error;
	}) {
		super({ message, cause });
	}
}
