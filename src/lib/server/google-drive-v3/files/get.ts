import {
	GOOGLE_DRIVE_V3_FILES_FIELDS,
	GOOGLE_DRIVE_V3_FILES_URL,
	type FileResource,
	type FilesParameters
} from '.';
import { fetchGoogleDriveV3 } from '../util';

export const get = async (token: string, id: string): Promise<FileResource> => {
	const query = {
		fields: GOOGLE_DRIVE_V3_FILES_FIELDS,
		q: 'trashed = false',
		supportsAllDrives: true
	} satisfies FilesParameters;

	const url = GOOGLE_DRIVE_V3_FILES_URL + id;
	return fetchGoogleDriveV3(url, { token, query });
};
