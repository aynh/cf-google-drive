import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { APP_CLIENT_ID, APP_CLIENT_SECRET, APP_REFRESH_TOKEN } from '$env/static/private';
import { resolve } from '$lib/server/google-drive-v3/';
import { fetchAccessToken } from '$lib/server/google-drive-v3/oauth';
import { download, get, GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';

const TOKEN_KV_KEY = '__access_token';

export const handle = (async ({ event, resolve: resolve_ }) => {
	try {
		const KV = event.platform?.env?.TOKEN_STORE;

		let token: string | undefined = undefined;
		if (KV !== undefined) {
			token = (await KV.get(TOKEN_KV_KEY)) ?? undefined;
		}

		if (token === undefined) {
			const { expires, token: token_ } = await fetchAccessToken({
				client_id: APP_CLIENT_ID,
				client_secret: APP_CLIENT_SECRET,
				refresh_token: APP_REFRESH_TOKEN
			});

			if (KV !== undefined) {
				await KV.put(TOKEN_KV_KEY, token_, { expirationTtl: expires });
			}

			token = token_;
		}

		// making sure path doesn't ends with / as it wiil
		// prevent resolve here from working correctly
		const path = event.url.pathname.replace(/\/$/, '');
		const root = env.APP_FOLDER_ID ?? (await get(token, 'root')).id;
		const value = await resolve(token, root, path);

		if (value === undefined) throw error(404);
		else if (value.mimeType !== GOOGLE_DRIVE_V3_FOLDER_MIME) {
			// return the "file" if current path is not a folder
			let { body, content } = await download(token, value.id);

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

			return new Response(body, {
				headers: {
					'content-length': String(size),
					'content-type': content.type ?? value.mimeType
				}
			});
		}

		event.locals.token = token;
		event.locals.pathValue = value;
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// ignores unknown errors
		throw error(500);
	}

	return resolve_(event);
}) satisfies Handle;
