import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthModule } from 'src/auth.module';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AuthService } from 'src/service/auth.service';

export interface TestInfo {
	app: INestApplication;
	mongoServer: MongoMemoryServer;
}

export const createTestingApp = async (): Promise<TestInfo> => {
	const mongoServer = await MongoMemoryServer.create();
	const dbURI = mongoServer.getUri();

	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({
				load: [
					() => ({
						AUTH_MONGODB_URI: dbURI,
						AUTH_MONGODB_DB_NAME: 'auth',
						AUTH_SERVER_PORT: 3000,
						AUTH_SERVER_JWT_SECRET: 'test-secret-key',
					}),
				],
			}),
			MongooseModule.forRoot(dbURI, { dbName: 'auth' }),
			AuthModule,
		],
	}).compile();

	const app = moduleFixture.createNestApplication();
	app.useGlobalPipes(new ValidationPipe());
	await app.init();

	return { app, mongoServer };
};

export const closeTestingApp = async (testApp: TestInfo): Promise<void> => {
	const { app, mongoServer } = testApp;
	await app.close();
	await mongoServer.stop();
};

export const cleanupDatabase = async (testApp: TestInfo): Promise<void> => {
	const connection: Connection = testApp.app.get(getConnectionToken());
	await connection.db.dropDatabase();
};

export const setupRootAdmin = async (
	app: INestApplication,
): Promise<string> => {
	await app.get(AuthService).onApplicationBootstrap();

	const rootId = process.env.AUTH_SERVER_ROOT_ADMIN_ID;
	const rootPw = process.env.AUTH_SERVER_ROOT_ADMIN_PW;

	const loginResponse = await request(app.getHttpServer())
		.post('/auth/users/login')
		.send({
			id: rootId,
			password: rootPw,
		})
		.expect(200);

	return loginResponse.body.accessToken;
};
