export const URLSearchParamsFromObject = (record: Record<string, { toString: () => string }>) => {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(record)) {
		search.append(key, value.toString());
	}

	return search;
};

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should give the same output as manual', () => {
		const result = URLSearchParamsFromObject({ q: 'query' });
		const manual = new URLSearchParams();
		manual.append('q', 'query');

		expect(manual.toString()).to.eq(result.toString());
	});
}
