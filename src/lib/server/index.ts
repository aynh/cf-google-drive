import {
	APP_CLIENT_ID,
	APP_CLIENT_SECRET,
	APP_FOLDER_ID,
	APP_REFRESH_TOKEN,
} from '$env/static/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { fetchAccessToken } from './google-drive-v3/oauth';
import { resolve } from './google-drive-v3';
import { download } from './google-drive-v3/files/download';
import { get } from './google-drive-v3/files/get';

const TOKEN_KV_KEY = '__access_token';
export const fetchToken = async ({ platform }: RequestEvent) => {
	const KV = platform?.env?.TOKEN_STORE;

	if (KV !== undefined) {
		const token = (await KV.get(TOKEN_KV_KEY)) ?? undefined;
		if (token !== undefined) {
			return token;
		}
	}

	const { expires, token } = await fetchAccessToken({
		client_id: APP_CLIENT_ID,
		client_secret: APP_CLIENT_SECRET,
		refresh_token: APP_REFRESH_TOKEN,
	});

	if (KV !== undefined) {
		await KV.put(TOKEN_KV_KEY, token, { expirationTtl: expires });
	}

	return token;
};

export const handleDownload = async ({ locals: { pathValue, token }, request }: RequestEvent) => {
	const range = request.headers.get('range') ?? undefined;
	const { content, ...response } = await download(token, pathValue.id, range);

	let { body } = response;
	let size = Number.parseInt(content.length ?? String(pathValue.size), 10);
	// if both content.length and pathValue.size is undefined (or invalid)
	if (Number.isNaN(size)) {
		// download the whole file as blob
		const blob = await new Response(body).blob();
		// re-set the body with the blob stream
		body = blob.stream();
		// set the size to the blob size
		size = blob.size;
	}

	const headers = new Headers({
		'accept-ranges': 'bytes',
		'content-length': String(size),
		'content-type': content.type ?? pathValue.mimeType,
		'last-modified': new Date(pathValue.modifiedTime).toUTCString(),
	});
	if (content.range !== undefined) {
		headers.set('content-range', content.range);
	}

	return new Response(body, { status: response.status, headers });
};

export const resolvePathValue = async ({ url, locals: { token } }: RequestEvent) => {
	// decode the path and remove trailing slash
	const path = decodeURIComponent(url.pathname).replace(/\/$/g, '');

	// use APP_FOLDER_ID environment variable OR fallback to root folder id if it's falsy
	const root = APP_FOLDER_ID || (await get(token, 'root')).id;
	const resolved = await resolve(token, root, path);

	if (resolved === undefined) {
		throw error(404);
	}

	return resolved;
};
