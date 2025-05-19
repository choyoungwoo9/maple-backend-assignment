import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AccountDomain, Role } from '../domain/account.domain';
import { AccountRepository } from 'src/repository/account.repository';
import {
	AuthServiceIdDuplicatedException,
	AuthServiceInvalidCredentialsException,
} from './exception/auth.service.exception';
import { WrapWith } from 'src/common/decorator/wrap-with.decorator';
import { AuthServiceExceptionWrapStrategy } from './exception/auth.service.exception.wrap-strategy';
import { JwtService } from '@nestjs/jwt';

@WrapWith(AuthServiceExceptionWrapStrategy)
@Injectable()
export class AuthService implements OnApplicationBootstrap {
	constructor(
		private readonly accountRepository: AccountRepository,
		private jwtService: JwtService,
	) {}
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

	async login({
		id,
		password,
	}: {
		id: string;
		password: string;
	}): Promise<{ accessToken: string }> {
		const account = await this.accountRepository.getAccountById(id);
		if (account === null) {
			throw new AuthServiceInvalidCredentialsException({});
		}
		const isCorrectPassword = await account.isCorrectPassword(password);
		if (!isCorrectPassword) {
			throw new AuthServiceInvalidCredentialsException({});
		}
		const accessToken = await this.generateAccessToken(
			account.exposedId,
			account.role,
		);
		return { accessToken };
	}

	private async generateAccessToken(exposedId: string, role: Role) {
		const expiresIn = '1h'; //TODO: Refresh Token 구현 후 짧게 변경
		const accessToken = await this.jwtService.signAsync(
			{ exposedId, role },
			{
				secret: process.env.AUTH_SERVER_JWT_SECRET,
				expiresIn,
				algorithm: 'HS256',
			},
		);
		return accessToken;
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
