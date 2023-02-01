export const fetchWithToken = async (
	input: URL | RequestInfo,
	token: string,
	init?: RequestInit | undefined
) =>
	fetch(input, {
		...init,
		headers: {
			...Object.fromEntries(new Headers(init?.headers).entries()),
			authorization: `Bearer ${token}`
		}
	});

type UrlQuery = Record<string, { toString: () => string } | undefined>;

export const urlWithQuery = (url: string, query: UrlQuery) => {
	const u = new URL(url);
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) u.searchParams.append(key, value.toString());
	}

	return u;
};

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should give the same output as expected', () => {
		const expected = new URL('https://google.com/?q=why');
		const result = urlWithQuery('https://google.com/', { q: 'why' });
		expect(result).toStrictEqual(expected);
	});
}
