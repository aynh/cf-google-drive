import { resolveFileType, FileType } from '$lib/filetype';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';
import { GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { list } from '$lib/server/google-drive-v3/files/list';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	try {
		// Format date into something like "29 Jan 2023, 19:51"
		const { format } = new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});

		return {
			promise: {
				items: list(locals.token, locals.pathValue.id).then((values) =>
					values.map(({ mimeType, modifiedTime, size, name: name_, thumbnailLink }) => {
						const type =
							mimeType === GOOGLE_DRIVE_V3_FOLDER_MIME
								? FileType.folder
								: resolveFileType({ name: name_, mimeType });

						// suffix name with / if it's a folder
						const name = type === FileType.folder ? `${name_}/` : name_;

						// Turn "29 Jan 2023, 19:51" into "29-Jan-2023 19:51"
						const modified = format(new Date(modifiedTime)).replaceAll(' ', '-').replace(',-', ' ');

						const size_ = size !== undefined ? Number.parseInt(size) : -1;

						return {
							name,
							modified,
							size: size_,
							thumbnail: thumbnailLink !== undefined,
							type,
						};
					}),
				),
			},
		};
	} catch (e) {
		if (e instanceof GoogleDriveV3Error) {
			throw error(500, e.error);
		}

		// rethrow unknown errors
		throw e;
	}
}) satisfies PageServerLoad;
