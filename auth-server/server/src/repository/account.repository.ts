import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument, AccountSchemaInfo } from './schema/account.schema';
import { AccountDomain } from 'src/domain/account.domain';
import { WrapWith } from 'src/common/decorator/wrap-with.decorator';
import { AuthRepositoryExceptionWrapStrategy } from './exception/auth.repository.exception.wrap-strategy';

@WrapWith(AuthRepositoryExceptionWrapStrategy)
@Injectable()
export class AccountRepository {
	constructor(
		@InjectModel(AccountSchemaInfo.name)
		private accountModel: Model<AccountSchemaInfo>,
	) {}

	async create(account: AccountDomain): Promise<AccountDomain> {
		const documentData = new AccountSchemaInfo({
			id: account.id,
			exposedId: account.exposedId,
			password: account.password,
			role: account.role,
		});
		const createdAccount = new this.accountModel(documentData);
		const savedDocument = await createdAccount.save();
		return this.accountDocumentToDomain(savedDocument);
	}

	async isExistById(id: string): Promise<boolean> {
		const document = await this.accountModel.exists({ id });
		return document !== null;
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
