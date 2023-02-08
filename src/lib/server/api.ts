import { json, type RequestEvent } from '@sveltejs/kit';
import { GOOGLE_DRIVE_V3_FOLDER_MIME } from './google-drive-v3/files';
import { list } from './google-drive-v3/files/list';

export interface ApiResponseItem {
	name: string;
	mime: string;
	size?: number;
	path: string;
}

export interface ApiResponse extends ApiResponseItem {
	items: ApiResponseItem[];
}

export const handleApiRequest = async ({ locals: { pathValue, token }, url }: RequestEvent) => {
	const response = {
		name: pathValue.name,
		mime: pathValue.mimeType,
		size: pathValue.size,
		path: url.pathname,
		items: []
	} as ApiResponse;

	// populate items if it's a folder
	if (pathValue.mimeType === GOOGLE_DRIVE_V3_FOLDER_MIME) {
		const { pathname } = url;
		const path = pathname.endsWith('/') ? pathname : `${pathname}/`; // ensure path always ends with a /
		response.items = (await list(token, pathValue.id)).map(({ name, mimeType: mime, size }) => {
			return { name, mime, size, path: `${path}${encodeURIComponent(name)}` };
		});
	}

	return json(response);
};

export const isApiRequest = (request: Request) => {
	const first = request.headers.get('accept')?.split(',').shift() ?? '';
	return !first.includes('text/html') && !first.includes('application/xhtml+xml');
};

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should check api request', () => {
		const request = new Request(import.meta.url);

		// no accept header
		expect(isApiRequest(request)).toBe(true);

		request.headers.set('accept', '*/*');
		// curl default accept header
		expect(isApiRequest(request)).toBe(true);

		request.headers.set(
			'accept',
			'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
		);
		// firefox 92 accept header
		expect(isApiRequest(request)).toBe(false);
	});
}
