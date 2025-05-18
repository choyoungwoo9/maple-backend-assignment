import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument, AccountSchemaInfo } from './schema/account.schema';
import { AccountDomain } from 'src/domain/account.domain';
import {
	AuthRepositoryException,
	AuthRepositoryUnexpectedException,
} from './exception/auth.repository.exception';
@Injectable()
export class AccountRepository {
	constructor(
		@InjectModel(AccountSchemaInfo.name)
		private accountModel: Model<AccountSchemaInfo>,
	) {}

	async create(account: AccountDomain): Promise<AccountDomain> {
		try {
			const documentData = new AccountSchemaInfo({
				id: account.id,
				exposedId: account.exposedId,
				password: account.password,
				role: account.role,
			});
			const createdAccount = new this.accountModel(documentData);
			const savedDocument = await createdAccount.save();
			return this.accountDocumentToDomain(savedDocument);
		} catch (error) {
			if (error instanceof AuthRepositoryException) {
				throw error;
			}
			throw new AuthRepositoryUnexpectedException(error);
		}
	}

	private accountDocumentToDomain(document: AccountDocument): AccountDomain {
		return new AccountDomain({
			id: document.id,
			password: document.password,
			exposedId: document.exposedId,
			role: document.role,
		});
	}
}
