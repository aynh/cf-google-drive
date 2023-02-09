import { GoogleDriveV3Error } from './error';

type Query = Record<string, { toString: () => string } | undefined>;

export const urlWithQuery = (url: string, query?: Query) => {
	const u = new URL(url);

	if (query === undefined) {
		return u;
	}

	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) u.searchParams.append(key, value.toString());
	}

	return u;
};

type FetchWrapperOptions = { token: string; query?: Query } & RequestInit;

export const fetchGoogleDriveV3Raw = async (
	url: string,
	{ token, query, ...init }: FetchWrapperOptions
): Promise<Response> => {
	const url_ = urlWithQuery(url, query);
	const response = await fetch(url_, {
		...init,
		headers: {
			...Object.fromEntries(new Headers(init?.headers).entries()),
			authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new GoogleDriveV3Error(await response.json());
	}

	return response;
};

export const fetchGoogleDriveV3 = async <T>(
	url: string,
	options: FetchWrapperOptions
): Promise<T> => {
	return fetchGoogleDriveV3Raw(url, options).then((response) => response.json());
};

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should give the same output as expected', () => {
		const expected = new URL('https://google.com/?q=why');
		const result = urlWithQuery('https://google.com/', { q: 'why' });
		expect(result).toStrictEqual(expected);
	});
}
