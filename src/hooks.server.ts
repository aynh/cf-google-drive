import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { APP_CLIENT_ID, APP_CLIENT_SECRET, APP_REFRESH_TOKEN } from '$env/static/private';
import { resolve } from '$lib/server/google-drive-v3/';
import { fetchAccessToken } from '$lib/server/google-drive-v3/oauth';
import { download, get, GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';

const TOKEN_KV_KEY = '__access_token';

export const handle = (async ({ event, resolve: _resolve }) => {
	try {
		const KV = event.platform?.env?.TOKEN_STORE;

		let token: string | undefined = undefined;
		if (KV !== undefined) {
			token = (await KV.get(TOKEN_KV_KEY)) ?? undefined;
		}

		if (token === undefined) {
			const { expires, token: _token } = await fetchAccessToken({
				client_id: APP_CLIENT_ID,
				client_secret: APP_CLIENT_SECRET,
				refresh_token: APP_REFRESH_TOKEN
			});

			if (KV !== undefined) {
				await KV.put(TOKEN_KV_KEY, _token, { expirationTtl: expires });
			}

			token = _token;
		}

		// making sure path doesn't ends with / as it wiil
		// prevent _resolve here from working correctly
		const path = event.url.pathname.replace(/\/$/, '');
		const root = env.APP_FOLDER_ID ?? (await get(token, 'root')).id;
		const value = await resolve(token, root, path);

		if (value === undefined) throw error(404);
		else if (value.mimeType !== GOOGLE_DRIVE_V3_FOLDER_MIME) {
			// return the "file" if current path is not a folder
			const { readable, headers } = await download(token, value.id);
			return new Response(readable, { headers });
		}

		event.locals.token = token;
		event.locals.pathValue = value;
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// ignores unknown errors
		throw error(500);
	} finally {
		return _resolve(event);
	}
}) satisfies Handle;
