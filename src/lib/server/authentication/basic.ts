export const parseBasicAuthorizationHeader = (header: string) => {
	const credentials = header.match(/Basic +(.+)/)?.[1];
	const split = atob(credentials ?? '').split(':');
	return { username: split.at(0)!, password: split.at(1) ?? '' };
};

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe.each([
		{ header: '', username: '', password: '' },
		{ header: 'invalid', username: '', password: '' },
		{ header: 'Basic eWFzc2VyOg==', username: 'yasser', password: '' },
		{ header: 'Basic OmFo', username: '', password: 'ah' },
		{ header: 'Basic eWFzc2VyOmFo', username: 'yasser', password: 'ah' },
		{ header: 'Basic    eWFzc2VyOmFo', username: 'yasser', password: 'ah' }
	])('`$header` parsed into `$username:$password`', ({ header, password, username }) => {
		it('should parse', () => {
			expect(parseBasicAuthorizationHeader(header)).toStrictEqual({ username, password });
		});
	});
}
