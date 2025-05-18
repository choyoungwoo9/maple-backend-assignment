import { AuthException } from 'src/common/exception/auth.exception';

export class AuthRepositoryException extends AuthException {
	constructor({ message, cause }: { message: string; cause?: Error }) {
		super({ message, cause });
	}
}

export class AuthRepositoryUnexpectedException extends AuthRepositoryException {
	constructor({
		message = '인증 저장소에서 예상치 못한 오류가 발생했습니다.',
		cause,
	}: {
		message?: string;
		cause?: Error;
	}) {
		super({ message, cause });
	}
}
