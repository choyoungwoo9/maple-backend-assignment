import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
	createTestingApp,
	closeTestingApp,
	cleanupDatabase,
	TestInfo,
} from './test-utils';
import { DEFAULT_TEST_USER } from './data-utils';

describe('회원가입 API (POST /auth/users/signup)', () => {
	let testInfo: TestInfo;
	let app: INestApplication;

	beforeAll(async () => {
		testInfo = await createTestingApp();
		app = testInfo.app;
	});

	afterAll(async () => {
		await closeTestingApp(testInfo);
	});

	afterEach(async () => {
		await cleanupDatabase(testInfo);
	});

	it('회원가입 성공', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send(DEFAULT_TEST_USER)
			.expect(201);
	});

	it('ID 중복 시 409 에러', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send(DEFAULT_TEST_USER)
			.expect(201);

		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send(DEFAULT_TEST_USER)
			.expect(409);
	});

	it('유효하지 않은 데이터일 경우 400 에러', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send({ password: DEFAULT_TEST_USER.password })
			.expect(400);

		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send({ id: DEFAULT_TEST_USER.id })
			.expect(400);
	});
});
