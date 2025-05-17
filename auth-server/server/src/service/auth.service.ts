import { Injectable } from '@nestjs/common';
import { AccountDomain, Role } from '../domain/account.domain';
import { AccountRepository } from 'src/repository/account.repository';

@Injectable()
export class AuthService {
	constructor(private readonly accountRepository: AccountRepository) {}
	async signupUser({ id, password }: { id: string; password: string }): Promise<string> {
		const user = AccountDomain.create({ id, password, role: Role.User });
		await this.accountRepository.create(user);
		const accessToken = this.generateAccessToken(user);
		return accessToken;
	}

	private generateAccessToken(account: AccountDomain): string {
		return 'access token';
	}
}
