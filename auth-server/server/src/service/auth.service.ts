import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AccountDomain, Role } from '../domain/account.domain';
import { AccountRepository } from 'src/repository/account.repository';
import { AuthServiceIdDuplicatedException } from './exception/auth.service.exception';
import { WrapWith } from 'src/common/decorator/wrap-with.decorator';
import { AuthServiceExceptionWrapStrategy } from './exception/auth.service.exception.wrap-strategy';

@WrapWith(AuthServiceExceptionWrapStrategy)
@Injectable()
export class AuthService implements OnApplicationBootstrap {
	constructor(private readonly accountRepository: AccountRepository) {}
	async onApplicationBootstrap() {
		const signupRootAdmin = async () => {
			const rootId = process.env.AUTH_SERVER_ROOT_ADMIN_ID;
			const rootPw = process.env.AUTH_SERVER_ROOT_ADMIN_PW;
			if (!rootId || !rootPw) return;

			const exists = await this.accountRepository.isExistById(rootId);
			if (!exists) {
				const root = await AccountDomain.create({
					id: rootId,
					password: rootPw,
					role: Role.Admin,
				});
				await this.accountRepository.create(root);
			}
		};
		await signupRootAdmin();
	}

	async signupUser({
		id,
		password,
	}: {
		id: string;
		password: string;
	}): Promise<void> {
		const isExist = await this.accountRepository.isExistById(id);
		if (isExist) {
			throw new AuthServiceIdDuplicatedException({});
		}
		const user = await AccountDomain.create({
			id,
			password,
			role: Role.User,
		});
		await this.accountRepository.create(user);
	}
}
