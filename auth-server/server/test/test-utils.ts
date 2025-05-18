import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthModule } from 'src/auth.module';
import { Connection } from 'mongoose';

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
