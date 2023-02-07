import { APP_BASIC_PASSWORD, APP_BASIC_USERNAME } from '$env/static/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { parseBasicAuthorizationHeader } from './basic';

// following this diagram: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication/http-auth-sequence-diagram.png
export const checkBasicAuthentication = ({ request }: RequestEvent) => {
	if (APP_BASIC_USERNAME === '') {
		return; // basic auth is disabled
	}

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
