import { fetchWithToken, urlWithQuery } from './util';
import { GoogleDriveV3Error } from './error';

export const GOOGLE_DRIVE_V3_FOLDER_MIME = 'application/vnd.google-apps.folder';
const GOOGLE_DRIVE_V3_FILES_URL = 'https://www.googleapis.com/drive/v3/files/';

export interface FilesParameters {
	/** The paths of the fields you want included in the response.
	 *
	 * @see https://developers.google.com/drive/api/guides/fields-parameter
	 */
	fields?: string;

	/** Whether both My Drive and shared drive items should be included in results.
	 * (Default: `false`)  */
	includeItemsFromAllDrives?: boolean;

	/** The maximum number of files to return per page. Partial or empty result
	 * pages are possible even before the end of the files list has been reached.
	 * Acceptable values are `1` to `1000`, inclusive.
	 * (Default: `100`) */
	pageSize?: number;

	/** The token for continuing a previous list request on the next page.
	 * This should be set to the value of 'nextPageToken' from the previous response.  */
	pageToken?: string;

	/** A query for filtering the file results. */
	q?: string;

	/** Whether the requesting application supports both My Drives and shared drives.
	 * (Default: `false`)  */
	supportsAllDrives?: boolean;
}

const GOOGLE_DRIVE_V3_FILES_FIELDS = 'id, name, modifiedTime, mimeType, parents, size';

export interface FileResource {
	/** The ID of the file. */
	id: string;

	/** The name of the file. This is not necessarily unique within a folder. */
	name: string;

	/** The MIME type of the file. */
	mimeType: string;

	/** The last time the file was modified by anyone (RFC 3339 date-time).  */
	modifiedTime: string;

	/** The IDs of the parent folders which contain the file */
	parents: string[];

	/** The size of the file's content in bytes. */
	size?: number;
}

export interface DownloadResponse {
	readable: ReadableStream<Uint8Array>;
	headers: Record<'content-length' | 'content-type', string>;
}

export interface ListResponse {
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

export const download = async (token: string, id: string): Promise<DownloadResponse> => {
	const parameters = {
		supportsAllDrives: true
	} satisfies FilesParameters;

	const url = urlWithQuery(GOOGLE_DRIVE_V3_FILES_URL + id, {
		...parameters,
		// from https://developers.google.com/drive/api/v3/reference/files/get#response:
		// If you provide the URL parameter alt=media, then the response includes the file contents in the response body.
		alt: 'media'
	});

	const response = await fetchWithToken(url, token);

	if (!response.ok || response.body == undefined) {
		throw new GoogleDriveV3Error(await response.json());
	}

	const { readable, writable } = new TransformStream<Uint8Array>();
	response.body.pipeTo(writable);

	return {
		readable,
		headers: {
			'content-type': response.headers.get('content-type')!,
			'content-length': response.headers.get('content-length')!
		}
	};
};

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
		const url = urlWithQuery(GOOGLE_DRIVE_V3_FILES_URL, { ...parameters, pageToken });
		const response = await fetchWithToken(url, token);

		if (!response.ok) {
			throw new GoogleDriveV3Error(await response.json());
		}

		const { files, nextPageToken } = (await response.json()) as ListResponse;

		pageToken = nextPageToken;
		resources.push(...files);
	} while (pageToken !== undefined);

	return resources;
};

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe('files methods', () => {
		let aTxt: FileResource | undefined = undefined;

		it('should list', async ({ token, folderId }) => {
			const listResults = await list(token, folderId);

			expect(listResults).toHaveLength(4);

			const items = listResults
				.map(({ name, mimeType, parents }) => ({ name, mimeType, parents }))
				.sort(({ name: a }, { name: b }) => a.localeCompare(b));
			expect(items).toStrictEqual([
				{ name: 'a.txt', mimeType: 'text/plain', parents: [folderId] },
				{ name: 'b.txt', mimeType: 'text/plain', parents: [folderId] },
				{ name: 'c.txt', mimeType: 'text/plain', parents: [folderId] },
				{ name: 'nested', mimeType: GOOGLE_DRIVE_V3_FOLDER_MIME, parents: [folderId] }
			]);

			aTxt = listResults.find(({ name }) => name === 'a.txt')!;
		});

		it('should get', async ({ token }) => {
			const getResult = await get(token, aTxt!.id);
			expect(getResult).toStrictEqual(aTxt);
		});

		it('should download', async ({ token }) => {
			const { readable, headers } = await download(token, aTxt!.id);
			const aTxtBody = await new Response(readable).text();
			expect(aTxtBody).toBe('a.txt');
			expect(headers['content-length']).toBeDefined();
			expect(headers['content-type']).toBeDefined();
		});
	});
}
