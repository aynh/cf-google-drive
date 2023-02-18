import { json, type RequestEvent } from '@sveltejs/kit';
import { GOOGLE_DRIVE_V3_FOLDER_MIME } from './google-drive-v3/files';
import { list } from './google-drive-v3/files/list';

export interface ApiResponseItem {
	name: string;
	mime: string;
	size?: number;
	path: string;
	url: string;
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
		url: url.toString(),
		items: [],
	} as ApiResponse;

	// populate items if it's a folder
	if (pathValue.mimeType === GOOGLE_DRIVE_V3_FOLDER_MIME) {
		response.items = (await list(token, pathValue.id)).map(({ name, mimeType: mime, size }) => {
			const url_ = new URL(url);
			url_.pathname += url.pathname.endsWith('/') ? name : `/${name}`;

			return {
				name,
				mime,
				size: size !== undefined ? Number.parseInt(size) : undefined,
				path: url_.pathname,
				url: url_.toString(),
			};
		});
	}

	return json(response);
};

// returns true if application/json is the most prioritized mime in accept header
// ref: https://developer.mozilla.org/en-US/docs/Glossary/Quality_values
export const isApiRequest = (request: Request) => {
	const accept = request.headers.get('accept') ?? undefined;
	if (accept === undefined) {
		return false;
	}

	let highest = '';
	let highestQuality = 0;
	const qualityRE = new RegExp(/;q=(?<quality>[\d.]+)$/);
	for (const part of accept.split(',')) {
		const quality = Number.parseFloat(qualityRE.exec(part)?.groups?.quality ?? '1');

		if (quality > highestQuality) {
			highest = part;
		}
	}

	return highest.includes('application/json');
};

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe.each([
		['application/json', true], // only application/json
		['application/json;q=0.9,text/plain', false], // application/json has lower quality
		['text/plain;q=0.9,application/json', true], // the opposite of above
		[
			'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
			false,
		], // firefox 92
	])('$1 is API request = $2', (accept, result) => {
		it('should check API request', () => {
			const request = new Request(import.meta.url, { headers: { accept } });
			expect(isApiRequest(request)).toBe(result);
		});
	});

	it('should check API request with no accept header', () => {
		const request = new Request(import.meta.url);
		expect(isApiRequest(request)).toBe(false);
	});
}
