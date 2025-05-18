import { v4 as uuidv4 } from 'uuid';
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

	static create({
		id,
		password,
		role,
	}: {
		id: string;
		password: string;
		role: Role;
	}) {
		const exposedId = uuidv4();
		return new AccountDomain({ id, password, exposedId, role });
	}
}
