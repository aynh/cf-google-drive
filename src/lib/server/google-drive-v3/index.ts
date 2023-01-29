import { get, GOOGLE_DRIVE_V3_FOLDER_MIME, list, type FileResource } from './files';

export const resolve = async (token: string, root: string, path: string) => {
	const paths = path.split('/').slice(1);
	if (paths.length === 0) return get(token, root);

	let current: Partial<FileResource> = {};
	while (paths.length > 0) {
		const resources = await list(token, current?.id ?? root);

		const part = paths.shift()!;
		const match = resources.find(({ name }) => name === part);
		if (match === undefined || (paths.length > 0 && match.mimeType !== GOOGLE_DRIVE_V3_FOLDER_MIME))
			return;

		current = match;
	}

	return current as FileResource;
};

if (import.meta.vitest) {
	const { expect, describe, it } = import.meta.vitest;

	describe.each([
		{ path: '/a.txt' },
		{ path: '/nested/directory' },
		{ path: '/nested/directory/file.txt' }
	])('should resolve $path', ({ path }) => {
		it('should resolve', async ({ accessToken, folderId }) => {
			const resolved = await resolve(accessToken, folderId, path);
			expect(resolved).toBeDefined();
		});
	});
}
