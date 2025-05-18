import { ExceptionWrapStrategy } from 'src/common/decorator/wrap-with.decorator';
import {
	AuthServiceException,
	AuthServiceUnexpectedException,
} from './auth.service.exception';

export const AuthServiceExceptionWrapStrategy: ExceptionWrapStrategy = (
	error,
) => {
	if (error instanceof AuthServiceException) {
		throw error;
	}
	throw new AuthServiceUnexpectedException({
		cause: error,
	});
};
