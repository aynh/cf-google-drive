import { GOOGLE_DRIVE_V3_FOLDER_MIME, type FileResource } from './files';
import { get } from './files/get';
import { list } from './files/list';
import type { GoogleDriveV3TestContext } from './setup-test';

export const resolve = async (token: string, root: string, path: string) => {
	if (path === '/') return get(token, root);

	const paths = path.split('/').map(decodeURIComponent).slice(1);

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
		{ path: '/' }, // root folder
		{ path: '/a.txt' },
		{ path: '/nested/directory' },
		{ path: '/nested/directory%20with%20%2F' }, // directory with /
		{ path: '/nested/directory/file.txt' },
	])('should resolve $path', ({ path }) => {
		it<GoogleDriveV3TestContext>('should resolve', async ({ token, folderId }) => {
			const value = await resolve(token, folderId, path);
			expect(value).toBeDefined();
		});
	});
}
