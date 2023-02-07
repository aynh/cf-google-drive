import { expect, it } from 'vitest';
import { checkApiKeyAuthentication, checkBasicAuthentication } from '.';

it('should authenticate api key', () => {
	const request = new Request(import.meta.url);
	const key = 'api-key';

	expect(
		() => checkApiKeyAuthentication(request, { key })
		// header is not set yet
	).toThrowError();

	request.headers.set('x-api-key', 'wrong');
	expect(
		() => checkApiKeyAuthentication(request, { key })
		// header is wrong
	).toThrowError();

	request.headers.set('x-api-key', key);
	expect(() => checkApiKeyAuthentication(request, { key })).not.toThrowError();
});

it('should authenticate basic http auth', () => {
	const request = new Request(import.meta.url);
	const username = 'username';
	const password = 'password';

	const response = checkBasicAuthentication(request, { username, password })!;
	// challenge response is returned if authorization header is not set
	expect(response).toBeDefined();
	expect(response.status).toBe(401);
	expect(response.headers.get('www-authenticate')).toBe('Basic');

	const wrong = Buffer.from('wrong:credentials').toString('base64');
	request.headers.set('authorization', `Basic ${wrong}`);
	expect(() => checkBasicAuthentication(request, { username, password })).toThrowError();

	const correct = Buffer.from(`${username}:${password}`).toString('base64');
	request.headers.set('authorization', `Basic ${correct}`);
	expect(() => checkBasicAuthentication(request, { username, password })).not.toThrowError();
});
