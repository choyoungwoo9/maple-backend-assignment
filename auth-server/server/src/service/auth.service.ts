import { Injectable } from '@nestjs/common';
import { AccountDomain, Role } from '../domain/account.domain';
import { AccountRepository } from 'src/repository/account.repository';
import {
	AuthServiceException,
	AuthServiceUnexpectedException,
} from './exception/auth.service.exception';

@Injectable()
export class AuthService {
	constructor(private readonly accountRepository: AccountRepository) {}
	async signupUser({
		id,
		password,
	}: {
		id: string;
		password: string;
	}): Promise<string> {
		try {
			const user = AccountDomain.create({
				id,
				password,
				role: Role.User,
			});
			await this.accountRepository.create(user);
			const accessToken = this.generateAccessToken(user);
			return accessToken;
		} catch (error) {
			if (error instanceof AuthServiceException) {
				throw error;
			}
			throw new AuthServiceUnexpectedException({ cause: error });
		}
	}

	private generateAccessToken(account: AccountDomain): string {
		return 'access token';
	}
}
