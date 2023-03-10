import type { SvelteComponentTyped } from 'svelte';
import type { FileType } from './filetype';

export interface FileValue {
	hasThumbnail: boolean;
	name: string;
	modified: string;
	size: number;
	type: FileType;

	// href is the full path of the file, including the website url; it is populated client-side
	href: string;
}

export interface ViewComponentProperties {
	promise: Promise<FileValue[]>;
}

export type ViewComponent = typeof SvelteComponentTyped<ViewComponentProperties>;
