import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
	createTestingApp,
	closeTestingApp,
	cleanupDatabase,
	TestInfo,
	setupRootAdmin,
} from './test-utils';
import { DEFAULT_TEST_USER } from './data-utils';
import { Role } from 'src/domain/account.domain';

describe('스태프 등록 API (POST /auth/staff/register)', () => {
	let testInfo: TestInfo;
	let app: INestApplication;
	let rootAccessToken: string;

	beforeAll(async () => {
		testInfo = await createTestingApp();
		app = testInfo.app;
	});

	beforeEach(async () => {
		await cleanupDatabase(testInfo);
		rootAccessToken = await setupRootAdmin(app);
	});

	afterAll(async () => {
		await closeTestingApp(testInfo);
	});

	it('스태프 등록 성공', async () => {
		const staffData = {
			id: 'staff123',
			password: 'password123',
			role: Role.Operator,
		};

		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.set('Authorization', `Bearer ${rootAccessToken}`)
			.send(staffData)
			.expect(201);
	});

	it.each([
		[Role.Operator, 'operator123'],
		[Role.Auditor, 'auditor123'],
		[Role.Admin, 'admin123'],
	])('각 역할별 스태프 등록 성공: %s', async (role, id) => {
		const staffData = {
			id,
			password: 'password123',
			role,
		};

		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.set('Authorization', `Bearer ${rootAccessToken}`)
			.send(staffData)
			.expect(201);
	});

	it('일반 사용자 토큰으로 스태프 등록 시도 시 401 에러', async () => {
		await request(app.getHttpServer())
			.post('/auth/users/signup')
			.send(DEFAULT_TEST_USER)
			.expect(201);

		const loginResponse = await request(app.getHttpServer())
			.post('/auth/users/login')
			.send(DEFAULT_TEST_USER)
			.expect(200);

		const userAccessToken = loginResponse.body.accessToken;

		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.set('Authorization', `Bearer ${userAccessToken}`)
			.send({
				id: 'staff123',
				password: 'password123',
				role: Role.Operator,
			})
			.expect(401);
	});

	it('토큰 없이 스태프 등록 시도 시 401 에러', async () => {
		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.send({
				id: 'staff123',
				password: 'password123',
				role: Role.Operator,
			})
			.expect(401);
	});

	it('ID 중복 시 409 에러', async () => {
		const staffData = {
			id: 'staff123',
			password: 'password123',
			role: Role.Operator,
		};

		// 첫 번째 스태프 등록
		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.set('Authorization', `Bearer ${rootAccessToken}`)
			.send(staffData)
			.expect(201);

		// 동일한 ID로 다시 등록 시도
		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.set('Authorization', `Bearer ${rootAccessToken}`)
			.send(staffData)
			.expect(409);
	});

	it('유효하지 않은 데이터일 경우 400 에러', async () => {
		// 필수 필드 누락
		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.set('Authorization', `Bearer ${rootAccessToken}`)
			.send({ password: 'password123', role: Role.Operator })
			.expect(400);

		// 잘못된 role 값
		await request(app.getHttpServer())
			.post('/auth/staff/register')
			.set('Authorization', `Bearer ${rootAccessToken}`)
			.send({
				id: 'staff123',
				password: 'password123',
				role: 'INVALID_ROLE',
			})
			.expect(400);
	});
});
