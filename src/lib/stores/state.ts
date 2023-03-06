import { browser } from '$app/environment';
import GridView from '$lib/components/views/GridView.svelte';
import TableView from '$lib/components/views/TableView.svelte';
import { git } from '$lib/constants';
import type { FileValue } from '$lib/types';
import type { SvelteComponentTyped } from 'svelte';
import { derived, writable } from 'svelte/store';

export enum ViewKind {
	grid,
	table,
}

export interface State {
	view: ViewKind;
	dark: boolean;
}

export type ViewComponent = typeof SvelteComponentTyped<{ promise: Promise<FileValue[]> }>;

export const state = writable<State>({ dark: false, view: ViewKind.table });

if (browser) {
	const key = `state-${git.hash}`;
	const value = localStorage.getItem(key);
	if (typeof value === 'string') {
		state.set(JSON.parse(value));
	}

	state.subscribe(($state) => {
		localStorage.setItem(key, JSON.stringify($state));
	});
}

const viewMap: Record<ViewKind, ViewComponent> = {
	[ViewKind.grid]: GridView,
	[ViewKind.table]: TableView,
};

export const View = derived(
	state,
	($state, set) => {
		set(viewMap[$state.view]);
	},
	TableView as ViewComponent,
);
