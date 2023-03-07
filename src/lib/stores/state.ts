import { browser } from '$app/environment';
import { navigating, page } from '$app/stores';
import { git } from '$lib/constants';
import { derived, writable } from 'svelte/store';

export enum ViewKind {
	grid,
	table,
}

export enum ThemeKind {
	dark,
	light,
}

export interface State {
	view: ViewKind;
	theme: ThemeKind;
}

export const state = writable<State>({ view: ViewKind.table, theme: ThemeKind.light });

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

export const url = derived(
	[navigating, page],
	([$navigating, $page], set) => {
		// this, to immediately show where they're navigating to, so navigating seems instantaneous
		set($navigating?.to?.url ?? $page.url);
	},
	new URL(import.meta.url),
);
