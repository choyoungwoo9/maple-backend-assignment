import {
	ConflictException,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { ExceptionWrapStrategy } from 'src/common/decorator/wrap-with.decorator';

import {
	AuthServiceIdDuplicatedException,
	AuthServiceInvalidCredentialsException,
	AuthServiceUnauthorizedException,
} from 'src/service/exception/auth.service.exception';

export const AuthControllerExceptionWrapStrategy: ExceptionWrapStrategy = (
	error,
) => {
	if (error instanceof AuthServiceIdDuplicatedException) {
		throw new ConflictException('ID 중복');
	}
	if (error instanceof AuthServiceInvalidCredentialsException) {
		throw new UnauthorizedException('일치하는 id, password 없음');
	}
	if (error instanceof AuthServiceUnauthorizedException) {
		throw new UnauthorizedException('권한없음');
	}
	console.error(error);
	throw new InternalServerErrorException('서버 오류');
};
