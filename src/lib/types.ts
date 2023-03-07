import type { SvelteComponentTyped } from 'svelte';
import type { FileType } from './filetype';

export interface FileValue {
	name: string;
	modified: string;
	size: number;
	thumbnail: boolean;
	type: FileType;

	// href is urlencoded name, it is populated client-side
	href: string;
}

export interface ViewComponentProperties {
	promise: Promise<FileValue[]>;
}

export type ViewComponent = typeof SvelteComponentTyped<ViewComponentProperties>;
