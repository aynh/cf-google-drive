// @ts-expect-error vite config define
export const git = __GIT__ as Record<'hash' | 'origin' | 'lastmod', string>;

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should be defined', () => {
		expect(git).toBeDefined();
		expect(git.hash).toBeDefined();
		expect(git.lastmod).toBeDefined();
		expect(git.origin).toBeDefined();
	});
}
