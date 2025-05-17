import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
	AccountSchemaInfo,
	AccountSchema,
} from './repository/schema/account.schema';
import { AccountRepository } from './repository/account.repository';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://root:example@localhost:27017', {
			dbName: 'auth',
		}),
		MongooseModule.forFeature([
			{ name: AccountSchemaInfo.name, schema: AccountSchema },
		]),
	],
	controllers: [AuthController],
	providers: [AuthService, AccountRepository],
})
export class AuthModule {}
