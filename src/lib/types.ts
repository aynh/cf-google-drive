import type { SvelteComponentTyped } from 'svelte';
import type { FileType } from './filetype';

export interface FileValue {
	name: string;
	modified: string;
	size: number;
	type: FileType;

	// thumbnail is
	// [height, width] of the image metadata if it exists
	// OR true if thumbnail is available
	// false otherwise
	thumbnail: boolean | [number, number];

	// href is the full path of the file, including the website url; it is populated client-side
	href: string;
}

export interface ViewComponentProperties {
	promise: Promise<FileValue[]>;
}

export type ViewComponent = typeof SvelteComponentTyped<ViewComponentProperties>;
