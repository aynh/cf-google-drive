import type { FileType } from './filetype';

export interface FileValue {
	folder: boolean;
	name: string;
	modified: string;
	path: string;
	size: number;
	thumbnail: boolean;
	type: FileType;
}
