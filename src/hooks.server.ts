import { error, type Handle } from '@sveltejs/kit';
import {
	APP_CLIENT_ID,
	APP_CLIENT_SECRET,
	APP_FOLDER_ID,
	APP_REFRESH_TOKEN
} from '$env/static/private';
import { resolve as _resolve } from '$lib/server/google-drive-v3/';
import { fetchAccessToken } from '$lib/server/google-drive-v3/oauth';
import { download, GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';

const ACCESS_TOKEN_KV_KEY = '__access_token';

export const handle = (async ({ event, resolve }) => {
	try {
		const KV = event.platform?.env?.TOKEN_STORE;

		let accessToken: string | undefined = undefined;
		if (KV !== undefined) {
			accessToken = (await KV.get(ACCESS_TOKEN_KV_KEY)) ?? undefined;
		}

		if (accessToken === undefined) {
			const { expires, token } = await fetchAccessToken({
				client_id: APP_CLIENT_ID,
				client_secret: APP_CLIENT_SECRET,
				refresh_token: APP_REFRESH_TOKEN
			});

			if (KV !== undefined) {
				await KV.put(ACCESS_TOKEN_KV_KEY, token, { expirationTtl: expires });
			}

			accessToken = token;
		}

		const path = event.url.pathname.replace(/\/$/, '');
		const value = await _resolve(accessToken, APP_FOLDER_ID, path);

		if (value === undefined) throw error(404);
		else if (value.mimeType !== GOOGLE_DRIVE_V3_FOLDER_MIME) {
			// return the file if current path is not a folder
			const { readable, headers } = await download(accessToken, value.id);
			return new Response(readable, { headers });
		}

		event.locals.accessToken = accessToken;
		event.locals.resolved = value;
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// ignores unknown errors
		throw error(500);
	}

	return resolve(event);
}) satisfies Handle;
