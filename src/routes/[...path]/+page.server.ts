import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';
import { GOOGLE_DRIVE_V3_FOLDER_MIME, list } from '$lib/server/google-drive-v3/files';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, depends, url }) => {
	const { pathname } = url;
	const parent = pathname.split('/').slice(0, -1).join('/') || '/'; // set parent to / if it's empty
	const _path = pathname.endsWith('/') ? pathname : `${pathname}/`; // ensure path always ends with a /
	const title = `Index of ${_path}`;

	depends(`route:${_path}`);
	try {
		const { format } = new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
		const items = await list(locals.accessToken, locals.resolved.id).then((it) =>
			it.map(({ mimeType, modifiedTime, size, name: _name }) => {
				const path = `${_path}${_name}`;

				const folder = mimeType === GOOGLE_DRIVE_V3_FOLDER_MIME;
				const name = folder ? `${_name}/` : _name;

				const modified = format(new Date(modifiedTime)).replaceAll(' ', '-').replace(',-', ' ');

				return { folder, name, modified, path, size };
			})
		);

		return { items, parent, title };
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// ignores unknown errors
		throw error(500);
	}
}) satisfies PageServerLoad;
