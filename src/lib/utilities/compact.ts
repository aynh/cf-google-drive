import type { FileValue } from '$lib/types';

type ServerFileValue = Omit<FileValue, 'href'>;

interface ServerFileValueMap {
	0: 'hasThumbnail';
	1: 'name';
	2: 'modified';
	3: 'size';
	4: 'type';
}

export type CompactFileValue = {
	[K in keyof ServerFileValueMap]: ServerFileValue[ServerFileValueMap[K]];
};

export const compact = ({
	hasThumbnail,
	modified,
	name,
	size,
	type,
}: ServerFileValue): CompactFileValue => {
	return [hasThumbnail, modified, name, size, type];
};

export const decompact = (c: CompactFileValue): ServerFileValue => {
	return { hasThumbnail: c[0], modified: c[1], name: c[2], size: c[3], type: c[4] };
};
