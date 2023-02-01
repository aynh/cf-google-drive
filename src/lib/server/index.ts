import type { KVNamespace } from '@cloudflare/workers-types';
import { APP_CLIENT_ID, APP_CLIENT_SECRET, APP_REFRESH_TOKEN } from '$env/static/private';
import { fetchAccessToken } from './google-drive-v3/oauth';
import { download, type FileResource } from './google-drive-v3/files';

const TOKEN_KV_KEY = '__access_token';

export const fetchToken = async (KV?: KVNamespace) => {
	if (KV !== undefined) {
		const token = (await KV.get(TOKEN_KV_KEY)) ?? undefined;
		if (token !== undefined) {
			return token;
		}
	}

	const { expires, token } = await fetchAccessToken({
		client_id: APP_CLIENT_ID,
		client_secret: APP_CLIENT_SECRET,
		refresh_token: APP_REFRESH_TOKEN
	});

	if (KV !== undefined) {
		await KV.put(TOKEN_KV_KEY, token, { expirationTtl: expires });
	}

	return token;
};

export const handleDownload = async (token: string, value: FileResource, range?: string) => {
	const { content, ...response } = await download(token, value.id, range);

	let { body } = response;
	let size = Number.parseInt(content.length ?? String(value.size), 10);
	// if both content.length and value.size is undefined (or invalid)
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
		'content-type': content.type ?? value.mimeType
	});
	if (content.range !== undefined) {
		headers.set('content-range', content.range);
	}

	return new Response(body, { status: response.status, headers });
};
