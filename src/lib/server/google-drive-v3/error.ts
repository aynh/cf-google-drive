export class GoogleDriveV3Error extends Error {
	error: GoogleDriveV3ErrorObject;

	constructor({ error }: { error: GoogleDriveV3ErrorObject }) {
		super();

		this.error = error;
	}
}

export interface GoogleDriveV3ErrorObject {
	errors: Record<string, string>[];
	code: number;
	message: string;
}
