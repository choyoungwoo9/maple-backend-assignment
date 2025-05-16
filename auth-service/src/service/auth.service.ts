import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	async signupUser(id: string, password: string): Promise<string> {
		console.log(`신규 회원가입: ${id}`);
		return 'access token';
	}
}
