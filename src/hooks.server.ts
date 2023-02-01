import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { resolve } from '$lib/server/google-drive-v3/';
import { get, GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';
import { fetchToken, handleDownload } from '$lib/server';

export const handle = (async ({ event, resolve: resolve_ }) => {
	try {
		const token = await fetchToken(event.platform?.env?.TOKEN_STORE);

		// decode the path and remove the trailing slash
		const path = decodeURIComponent(event.url.pathname).replace(/\/$/g, '');
		const root = env.APP_FOLDER_ID ?? (await get(token, 'root')).id;
		const value = await resolve(token, root, path);

		if (value === undefined) {
			throw error(404);
		} else if (value.mimeType !== GOOGLE_DRIVE_V3_FOLDER_MIME) {
			const range = event.request.headers.get('range') ?? undefined;
			// return the "file" if current path is not a folder
			return handleDownload(token, value, range);
		}

		event.locals.token = token;
		event.locals.pathValue = value;
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// rethrow unknown errors
		throw e;
	}

	return resolve_(event);
}) satisfies Handle;
