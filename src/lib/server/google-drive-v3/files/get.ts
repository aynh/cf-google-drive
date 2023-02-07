import {
	GOOGLE_DRIVE_V3_FILES_FIELDS,
	GOOGLE_DRIVE_V3_FILES_URL,
	type FileResource,
	type FilesParameters
} from '.';
import { GoogleDriveV3Error } from '../error';
import { fetchWithToken, urlWithQuery } from '../util';

export const get = async (token: string, id: string): Promise<FileResource> => {
	const parameters = {
		fields: GOOGLE_DRIVE_V3_FILES_FIELDS,
		q: 'trashed = false',
		supportsAllDrives: true
	} satisfies FilesParameters;

	const url = urlWithQuery(GOOGLE_DRIVE_V3_FILES_URL + id, parameters);
	const response = await fetchWithToken(url, token);

	if (!response.ok) {
		throw new GoogleDriveV3Error(await response.json());
	}

	return response.json();
};
