import { ExceptionWrapStrategy } from 'src/common/decorator/wrap-with.decorator';
import { AuthRepositoryUnexpectedException } from './auth.repository.exception';

export const AuthRepositoryExceptionWrapStrategy: ExceptionWrapStrategy = (
	error,
) => {
	if (error instanceof AuthRepositoryUnexpectedException) {
		throw error;
	}
	throw new AuthRepositoryUnexpectedException({
		cause: error,
	});
};
