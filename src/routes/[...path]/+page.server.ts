import { compact } from '$lib/utilities/compact';
import { resolveFileType, FileType } from '$lib/filetype';
import { GoogleDriveV3Error } from '$lib/server/google-drive-v3/error';
import { GOOGLE_DRIVE_V3_FOLDER_MIME } from '$lib/server/google-drive-v3/files';
import { list } from '$lib/server/google-drive-v3/files/list';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	params.path; // depends(params.path)

	try {
		// format date into something like "29 Jan 2023, 19:51"
		const dateFormat = new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});

		// Turn "29 Jan 2023, 19:51" into "29-Jan-2023 19:51"
		const format = (date: Date) => dateFormat.format(date).replaceAll(' ', '-').replace(',-', ' ');

		return {
			items: {
				promise: list(locals.token, locals.pathValue.id).then((values) => {
					return values.map(({ mimeType, modifiedTime, size: size_, name, thumbnailLink }) => {
						const hasThumbnail = thumbnailLink !== undefined;
						const modified = format(new Date(modifiedTime));
						const size = Number(size_);
						const type =
							mimeType === GOOGLE_DRIVE_V3_FOLDER_MIME
								? FileType.folder
								: resolveFileType({ name, mimeType });

						return compact({ hasThumbnail, modified, name, size, type });
					});
				}),
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
