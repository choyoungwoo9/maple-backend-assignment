import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
	createTestingApp,
	closeTestingApp,
	cleanupDatabase,
	TestInfo,
} from './test-utils';
import { DEFAULT_TEST_USER } from './data-utils';

describe('로그인 API (POST /auth/users/login)', () => {
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

	it('로그인 성공 시 accessToken 반환', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send(DEFAULT_TEST_USER)
			.expect(201);

		const response = await request(app.getHttpServer())
			.post('/auth/users/login')
			.send(DEFAULT_TEST_USER)
			.expect(200);

		expect(response.body).toHaveProperty('accessToken');
		expect(typeof response.body.accessToken).toBe('string');
	});

	it('존재하지 않는 ID로 로그인 시도 시 401 에러', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/login')
			.send(DEFAULT_TEST_USER)
			.expect(401);
	});

	it('잘못된 비밀번호로 로그인 시도 시 401 에러', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send(DEFAULT_TEST_USER)
			.expect(201);

		await request(app.getHttpServer())
			.post('/auth/users/login')
			.send({
				...DEFAULT_TEST_USER,
				password: 'wrongpassword',
			})
			.expect(401);
	});

	it('유효하지 않은 데이터일 경우 400 에러', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/login')
			.send({ password: DEFAULT_TEST_USER.password })
			.expect(400);

		await request(app.getHttpServer())
			.post('/auth/users/login')
			.send({ id: DEFAULT_TEST_USER.id })
			.expect(400);
	});
});
