import {
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common';
import { ExceptionWrapStrategy } from 'src/common/decorator/wrap-with.decorator';

import { AuthServiceIdDuplicatedException } from 'src/service/exception/auth.service.exception';

export const AuthControllerExceptionWrapStrategy: ExceptionWrapStrategy = (
	error,
) => {
	if (error instanceof AuthServiceIdDuplicatedException) {
		throw new ConflictException('ID 중복');
	}
	throw new InternalServerErrorException('서버 오류');
};
