import { error, type Handle } from '@sveltejs/kit';
import {
	APP_CLIENT_ID,
	APP_CLIENT_SECRET,
	APP_FOLDER_ID,
	APP_REFRESH_TOKEN
} from '$env/static/private';
import { resolve as resolvePath } from '$lib/server/google-drive-v3/';
import { fetchAccessToken } from '$lib/server/google-drive-v3/oauth';
import { download, GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';

export const handle = (async ({ event, resolve }) => {
	try {
		event.locals.accessToken = await fetchAccessToken({
			client_id: APP_CLIENT_ID,
			client_secret: APP_CLIENT_SECRET,
			refresh_token: APP_REFRESH_TOKEN
		});

		const value = await resolvePath(
			event.locals.accessToken,
			APP_FOLDER_ID,
			event.url.pathname.replace(/\/$/, '')
		);

		if (value === undefined) throw error(404);
		else if (value.mimeType !== GOOGLE_DRIVE_V3_FOLDER_MIME) {
			// return the file if current path is not a folder
			const readable = await download(event.locals.accessToken, value.id);
			return new Response(readable, { headers: { 'Content-Type': value.mimeType } });
		}

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
