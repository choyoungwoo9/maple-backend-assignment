import { AccountDomain, Role } from './account.domain';

describe('AccountDomain', () => {
	const id = 'id123';
	const password = 'password123';
	const role = Role.User;

	describe('create', () => {
		it('id, role이 정확히 설정 되었는지', async () => {
			const account = await AccountDomain.create({ id, password, role });
			expect(account.id).toBe(id);
			expect(account.role).toBe(role);
		});

		it('노출용 id가 생성되었는지', async () => {
			const account = await AccountDomain.create({ id, password, role });
			expect(account.exposedId).toBeDefined();
		});

		it('비밀번호가 암호화 되었는지', async () => {
			const account = await AccountDomain.create({ id, password, role });
			expect(account.password).not.toBe(password);
		});
	});

	describe('comparePassword', () => {
		it('올바른 비밀번호일때 true', async () => {
			const account = await AccountDomain.create({ id, password, role });
			const result = await account.isCorrectPassword(password);
			expect(result).toBe(true);
		});

		it('잘못된 비밀번호일때 false', async () => {
			const account = await AccountDomain.create({ id, password, role });
			const result = await account.isCorrectPassword('wrong-password');
			expect(result).toBe(false);
		});
	});
});
