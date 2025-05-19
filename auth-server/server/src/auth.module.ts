import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
	AccountSchemaInfo,
	AccountSchema,
} from './repository/schema/account.schema';
import { AccountRepository } from './repository/account.repository';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.AUTH_MONGODB_URI, {
			dbName: process.env.AUTH_MONGODB_DB_NAME,
		}),
		MongooseModule.forFeature([
			{ name: AccountSchemaInfo.name, schema: AccountSchema },
		]),
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [AuthService, AccountRepository],
})
export class AuthModule {}
