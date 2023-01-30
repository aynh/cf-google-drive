import { afterAll, beforeAll, beforeEach } from 'vitest';
import { fetchAccessToken } from './oauth';

let token = '';
let folderId = '';

beforeAll(async () => {
	const keys = ['TEST_CLIENT_ID', 'TEST_CLIENT_SECRET', 'TEST_REFRESH_TOKEN', 'TEST_FOLDER_ID'];

	for (const key of keys) {
		if (typeof import.meta.env[key] !== 'string') throw `${key} is not defined`;
	}

	folderId = import.meta.env.TEST_FOLDER_ID;
	({ token } = await fetchAccessToken({
		client_id: import.meta.env.TEST_CLIENT_ID,
		client_secret: import.meta.env.TEST_CLIENT_SECRET,
		refresh_token: import.meta.env.TEST_REFRESH_TOKEN
	}));
});

beforeEach((context) => {
	context.token = token;
	context.folderId = folderId;
});

afterAll(() => {
	token = '';
	folderId = '';
});
