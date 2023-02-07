import { error } from '@sveltejs/kit';
import { parseBasicAuthorizationHeader } from './basic';

export const checkApiKeyAuthentication = (request: Request, { key }: { key: string }) => {
	if (request.headers.get('x-api-key') !== key) {
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
