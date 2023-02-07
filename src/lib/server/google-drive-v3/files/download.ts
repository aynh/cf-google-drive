import { GOOGLE_DRIVE_V3_FILES_URL, type FilesParameters } from '.';
import { GoogleDriveV3Error } from '../error';
import { fetchWithToken, urlWithQuery } from '../util';

interface DownloadResponse {
	body: ReadableStream<Uint8Array>;
	status: number;
	content: Record<'length' | 'range' | 'type', string | undefined>;
}

export const download = async (
	token: string,
	id: string,
	range?: string
): Promise<DownloadResponse> => {
	const parameters = {
		supportsAllDrives: true
	} satisfies FilesParameters;

	const url = urlWithQuery(GOOGLE_DRIVE_V3_FILES_URL + id, {
		...parameters,
		// from https://developers.google.com/drive/api/v3/reference/files/get#response:
		// If you provide the URL parameter alt=media, then the response includes the file contents in the response body.
		alt: 'media'
	});

	const headers = new Headers();
	if (range !== undefined) {
		headers.set('range', range);
	}

	const response = await fetchWithToken(url, token, { headers });

	if (!response.ok || response.body == undefined) {
		throw new GoogleDriveV3Error(await response.json());
	}

	const contentHeader = (key: string) => response.headers.get(`content-${key}`) ?? undefined;

	return {
		body: response.body,
		status: response.status,
		content: {
			type: contentHeader('type'),
			range: contentHeader('range'),
			length: contentHeader('length')
		}
	};
};
