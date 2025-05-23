import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/domain/account.domain';

export type AccountDocument = HydratedDocument<AccountSchemaInfo>;

@Schema({ collection: 'accounts' })
export class AccountSchemaInfo {
	constructor({
		id,
		exposedId,
		password,
		role,
	}: {
		id: string;
		exposedId: string;
		password: string;
		role: Role;
	}) {
		this.id = id;
		this.exposedId = exposedId;
		this.password = password;
		this.role = role;
	}
	@Prop({ type: String, required: true, unique: true })
	id: string;

	@Prop({ type: String, required: true, unique: true })
	exposedId: string;

	@Prop({ type: String, required: true })
	password: string;

	@Prop({ type: String, required: true, enum: Role })
	role: Role;

	@Prop({ type: String, required: false })
	createdBy?: string;
}

export const AccountSchema = SchemaFactory.createForClass(AccountSchemaInfo);
