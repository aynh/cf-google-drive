import { error } from '@sveltejs/kit';
import { parseBasicAuthorizationHeader } from './basic';

export const checkApiKeyAuthentication = (request: Request, { key }: { key: string }) => {
	const keyHeader = request.headers.get('x-api-key');
	const keyQuery = new URL(request.url).searchParams.get('key');

	if (keyHeader !== key && keyQuery !== key) {
		throw error(401);
	}
};

// following this diagram: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication/http-auth-sequence-diagram.png
export const checkBasicAuthentication = (
	request: Request,
	options: Record<'username' | 'password', string>
) => {
	const authorizationHeader = request.headers.get('authorization') ?? undefined;
	if (authorizationHeader === undefined) {
		return new Response(undefined, {
			status: 401,
			headers: { 'www-authenticate': 'Basic' }
		});
	}

	const { username, password } = parseBasicAuthorizationHeader(authorizationHeader);
	if (username !== options.username || password !== options.password) {
		throw error(401);
	}
};

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should authenticate api key (header)', () => {
		const request = new Request(import.meta.url);
		const key = 'key';

		expect(
			() => checkApiKeyAuthentication(request, { key })
			// header is not set
		).toThrowError();

		request.headers.set('x-api-key', 'wrong');
		expect(
			() => checkApiKeyAuthentication(request, { key })
			// header is wrong
		).toThrowError();

		request.headers.set('x-api-key', key);
		expect(() => checkApiKeyAuthentication(request, { key })).not.toThrowError();
	});

	it('should authenticate api key (search query)', () => {
		const url = new URL(import.meta.url);
		const key = 'key';

		expect(
			() => checkApiKeyAuthentication(new Request(url), { key })
			// no search query
		).toThrowError();

		url.searchParams.set('key', 'wrong');
		expect(
			() => checkApiKeyAuthentication(new Request(url), { key })
			// search query is wrong
		).toThrowError();

		url.searchParams.set('key', key);
		expect(() => checkApiKeyAuthentication(new Request(url), { key })).not.toThrowError();
	});

	it('should authenticate api key (header OR search query)', () => {
		const url = new URL(import.meta.url);
		const headers = new Headers();
		const key = 'key';

		expect(
			() => checkApiKeyAuthentication(new Request(url, { headers }), { key })
			// no header or search query
		).toThrowError();

		url.searchParams.set('key', 'wrong');
		headers.set('x-api-key', 'wrong');
		expect(
			() => checkApiKeyAuthentication(new Request(url, { headers }), { key })
			// search query and header is wrong
		).toThrowError();

		url.searchParams.set('key', 'wrong');
		headers.set('x-api-key', key);
		expect(
			() => checkApiKeyAuthentication(new Request(url, { headers }), { key })
			// search query is wrong, but header is right
		).not.toThrowError();

		url.searchParams.set('key', key);
		headers.set('x-api-key', 'wrong');
		expect(() =>
			// search query is right, but header is wrong
			checkApiKeyAuthentication(new Request(url, { headers }), { key })
		).not.toThrowError();
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
}
