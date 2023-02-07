import { APP_API_KEY, APP_BASIC_PASSWORD, APP_BASIC_USERNAME } from '$env/static/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { parseBasicAuthorizationHeader } from './basic';

export const checkApiKeyAuthentication = ({ request }: RequestEvent) => {
	if (request.headers.get('x-api-key') !== APP_API_KEY) {
		throw error(401);
	}
};

// following this diagram: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication/http-auth-sequence-diagram.png
export const checkBasicAuthentication = ({ request }: RequestEvent) => {
	const authorizationHeader = request.headers.get('authorization') ?? undefined;
	if (authorizationHeader === undefined) {
		return new Response(undefined, {
			status: 401,
			headers: { 'www-authenticate': 'Basic' }
		});
	}

	const { username, password } = parseBasicAuthorizationHeader(authorizationHeader);
	if (APP_BASIC_USERNAME !== username || APP_BASIC_PASSWORD !== password) {
		throw error(401);
	}
};
