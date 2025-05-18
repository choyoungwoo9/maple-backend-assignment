import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export enum Role {
	User = 'USER',
	Admin = 'ADMIN',
	Operator = 'OPERATOR',
	Auditor = 'AUDITOR',
}

export class AccountDomain {
	id: string;
	password: string;
	exposedId: string;
	role: Role;

	constructor({
		id,
		password,
		exposedId,
		role,
	}: {
		id: string;
		password: string;
		exposedId: string;
		role: Role;
	}) {
		this.id = id;
		this.exposedId = exposedId;
		this.password = password;
		this.role = role;
	}

	static async create({
		id,
		password,
		role,
	}: {
		id: string;
		password: string;
		role: Role;
	}) {
		const exposedId = uuidv4();
		const encryptedPassword = await AccountDomain.encryptPassword(password);
		return new AccountDomain({
			id,
			password: encryptedPassword,
			exposedId,
			role,
		});
	}

	private static async encryptPassword(password: string) {
		const saltOrRounds = 10;
		return bcrypt.hash(password, saltOrRounds);
	}

	async isCorrectPassword(password: string) {
		return bcrypt.compare(password, this.password);
	}
}
