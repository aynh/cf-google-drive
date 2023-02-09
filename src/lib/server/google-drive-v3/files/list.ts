import {
	GOOGLE_DRIVE_V3_FILES_FIELDS,
	GOOGLE_DRIVE_V3_FILES_URL,
	type FileResource,
	type FilesParameters
} from '.';
import { fetchGoogleDriveV3 } from '../util';

interface ListResponse {
	/**
	 * The page token for the next page of files.
	 * This will be absent if the end of the files list has been reached.
	 */
	nextPageToken?: string;

	/**
	 * The list of files.
	 * If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched.
	 */
	files: FileResource[];
}

export const list = async (token: string, folderId: string): Promise<FileResource[]> => {
	const parameters = {
		fields: `nextPageToken, files(${GOOGLE_DRIVE_V3_FILES_FIELDS})`,
		q: `trashed = false and '${folderId}' in parents`,
		includeItemsFromAllDrives: true,
		pageSize: 1000,
		supportsAllDrives: true
	} satisfies FilesParameters;

	const resources = [] as FileResource[];
	let pageToken: string | undefined = undefined;
	do {
		const { files, nextPageToken } = (await fetchGoogleDriveV3(GOOGLE_DRIVE_V3_FILES_URL, {
			token,
			query: { ...parameters, pageToken }
		})) as ListResponse;

		pageToken = nextPageToken;
		resources.push(...files);
	} while (pageToken !== undefined);

	return resources;
};
