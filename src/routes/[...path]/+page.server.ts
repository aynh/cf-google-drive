import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';
import { GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { list } from '$lib/server/google-drive-v3/files/list';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, depends, url }) => {
	const { pathname } = url;
	const parent = pathname.split('/').slice(0, -1).join('/') || '/'; // set parent to / if it's empty
	const path = pathname.endsWith('/') ? pathname : `${pathname}/`; // ensure path always ends with a /
	const title = `Index of ${decodeURIComponent(path)}`;

	depends(`route:${path}`);
	try {
		// Format date into something like "29 Jan 2023, 19:51"
		const { format } = new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
		const items = (await list(locals.token, locals.pathValue.id)).map(
			({ mimeType, modifiedTime, size, name: name_ }) => {
				const path_ = `${path}${name_}`;

				const folder = mimeType === GOOGLE_DRIVE_V3_FOLDER_MIME;
				// suffix name with / if it's a folder
				const name = folder ? `${name_}/` : name_;

				// Turn "29 Jan 2023, 19:51" into "29-Jan-2023 19:51"
				const modified = format(new Date(modifiedTime)).replaceAll(' ', '-').replace(',-', ' ');

				const size_ = size !== undefined ? Number.parseInt(size) : -1;

				return { folder, name, modified, path: path_, size: size_ };
			},
		);

		return { items, parent, title };
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// rethrow unknown errors
		throw e;
	}
}) satisfies PageServerLoad;
