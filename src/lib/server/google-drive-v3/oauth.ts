import { GoogleDriveV3Error } from './error';

interface FetchAccessTokenParams {
	/** The client ID obtained from the [API Console](https://console.developers.google.com/). */
	client_id: string;
	/** The client secret obtained from the [API Console](https://console.developers.google.com/). */
	client_secret: string;
	/** The refresh token returned from the authorization code exchange. */
	refresh_token: string;
}

export const fetchAccessToken = async ({
	client_id,
	client_secret,
	refresh_token
}: FetchAccessTokenParams) => {
	const body = new URLSearchParams({
		client_id,
		client_secret,
		refresh_token,
		grant_type: 'refresh_token'
	});

	const response = await fetch('https://oauth2.googleapis.com/token', {
		body,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		method: 'POST'
	});

	if (!response.ok) {
		throw new GoogleDriveV3Error(await response.json());
	}

	return response.json().then(({ access_token }: { access_token: string }) => access_token);
};

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should return an access token', async ({ accessToken }) => {
		// set in setup-test.ts
		expect(accessToken).toBeDefined();
	});
}
