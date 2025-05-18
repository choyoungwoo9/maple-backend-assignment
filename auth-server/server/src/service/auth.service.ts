import { Injectable } from '@nestjs/common';
import { AccountDomain, Role } from '../domain/account.domain';
import { AccountRepository } from 'src/repository/account.repository';
import {
	AuthServiceException,
	AuthServiceUnexpectedException,
	AuthServiceIdDuplicatedException,
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
	}): Promise<void> {
		try {
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
		} catch (error) {
			if (error instanceof AuthServiceException) {
				throw error;
			}
			throw new AuthServiceUnexpectedException({ cause: error });
		}
	}
}
