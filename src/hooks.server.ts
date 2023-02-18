import { error, type Handle } from '@sveltejs/kit';
import { GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';
import { fetchToken, handleDownload, resolvePathValue } from '$lib/server';
import { checkApiKeyAuthentication, checkBasicAuthentication } from '$lib/server/authentication';
import { APP_API_KEY, APP_BASIC_PASSWORD, APP_BASIC_USERNAME } from '$env/static/private';

export const handle = (async ({ event, resolve }) => {
	if (APP_API_KEY !== '') {
		checkApiKeyAuthentication(event.request, { key: APP_API_KEY });
	}

	if (APP_BASIC_USERNAME !== '' || APP_BASIC_PASSWORD !== '') {
		const challengeResponse = checkBasicAuthentication(event.request, {
			username: APP_BASIC_USERNAME,
			password: APP_BASIC_PASSWORD
		});

		if (challengeResponse !== undefined) {
			return challengeResponse;
		}
	}

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
