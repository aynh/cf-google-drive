import { error, type Handle } from '@sveltejs/kit';
import { GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';
import { fetchToken, handleDownload, resolvePathValue } from '$lib/server';

export const handle = (async ({ event, resolve }) => {
	try {
		event.locals.token = await fetchToken(event);
		event.locals.pathValue = await resolvePathValue(event);

		if (event.locals.pathValue.mimeType !== GOOGLE_DRIVE_V3_FOLDER_MIME) {
			// return the "file" if current path is not a folder
			return handleDownload(event);
		}
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// rethrow unknown errors
		throw e;
	}

	return resolve(event);
}) satisfies Handle;
