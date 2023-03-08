import type { FileValue } from './types';

type ServerFileValue = Omit<FileValue, 'href'>;

interface ServerFileValueMap {
	0: 'thumbnail';
	1: 'name';
	2: 'modified';
	3: 'size';
	4: 'type';
}

export type FileValueCompact = {
	[K in keyof ServerFileValueMap]: ServerFileValue[ServerFileValueMap[K]];
};

export const compact = ({
	thumbnail,
	modified,
	name,
	size,
	type,
}: ServerFileValue): FileValueCompact => {
	return [thumbnail, modified, name, size, type];
};

// @ts-expect-error trust me
export const decompact = ([
	thumbnail,
	modified,
	name,
	size,
	type,
]: FileValueCompact): ServerFileValue => {
	return { thumbnail, modified, name, size, type };
};
