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
	createdBy?: string;

	constructor({
		id,
		password,
		exposedId,
		role,
		createdBy,
	}: {
		id: string;
		password: string;
		exposedId: string;
		role: Role;
		createdBy?: string;
	}) {
		this.id = id;
		this.exposedId = exposedId;
		this.password = password;
		this.role = role;
		this.createdBy = createdBy;
	}

	static async create({
		id,
		password,
		role,
		createdBy,
	}: {
		id: string;
		password: string;
		role: Role;
		createdBy?: string;
	}) {
		const exposedId = uuidv4();
		const encryptedPassword = await AccountDomain.encryptPassword(password);
		return new AccountDomain({
			id,
			password: encryptedPassword,
			exposedId,
			role,
			createdBy,
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
