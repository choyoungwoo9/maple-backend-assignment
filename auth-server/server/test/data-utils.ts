export interface TestUser {
	id: string;
	password: string;
}

export const DEFAULT_TEST_USER: TestUser = {
	id: 'testuser123',
	password: 'password123',
};
