import { describe, expect, it } from 'vitest';
import { GOOGLE_DRIVE_V3_FOLDER_MIME, type FileResource } from '.';
import { download } from './download';
import { get } from './get';
import { list } from './list';

describe('files methods', () => {
	let aTxt: FileResource | undefined = undefined;

	it('should list', async ({ token, folderId }) => {
		const listResults = await list(token, folderId);

		expect(listResults).toHaveLength(4);

		const items = listResults
			.map(({ name, mimeType, parents }) => ({ name, mimeType, parents }))
			.sort(({ name: a }, { name: b }) => a.localeCompare(b));
		expect(items).toStrictEqual([
			{ name: 'a.txt', mimeType: 'text/plain', parents: [folderId] },
			{ name: 'b.txt', mimeType: 'text/plain', parents: [folderId] },
			{ name: 'c.txt', mimeType: 'text/plain', parents: [folderId] },
			{ name: 'nested', mimeType: GOOGLE_DRIVE_V3_FOLDER_MIME, parents: [folderId] },
		]);

		aTxt = listResults.find(({ name }) => name === 'a.txt')!;
	});

	it('should get', async ({ token }) => {
		const getResult = await get(token, aTxt!.id);
		expect(getResult).toStrictEqual(aTxt);
	});

	it('should download', async ({ token }) => {
		const { body, status, content } = await download(token, aTxt!.id);
		const aTxtBody = await new Response(body).text();
		expect(aTxtBody).toBe('a.txt');

		expect(status).toBe(200);

		expect(content.length).toBe('5');
		expect(content.type).toBe('text/plain');
		expect(content.range).toBeUndefined();
	});

	it('should download in range', async ({ token }) => {
		const { body, status, content } = await download(token, aTxt!.id, 'bytes=2-5');
		const aTxtBody = await new Response(body).text();
		expect(aTxtBody).toBe('txt');

		expect(status).toBe(206);

		expect(content.length).toBe('3');
		expect(content.type).toBe('text/plain');
		expect(content.range).toBe('bytes 2-4/5');
	});
});
