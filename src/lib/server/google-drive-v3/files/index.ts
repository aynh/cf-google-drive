export const GOOGLE_DRIVE_V3_FOLDER_MIME = 'application/vnd.google-apps.folder';

export const GOOGLE_DRIVE_V3_FILES_URL = 'https://www.googleapis.com/drive/v3/files/';
export const GOOGLE_DRIVE_V3_FILES_FIELDS = 'id, name, modifiedTime, mimeType, parents, size';

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
