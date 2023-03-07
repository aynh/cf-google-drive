import { browser } from '$app/environment';
import { navigating, page } from '$app/stores';
import { git } from '$lib/constants';
import { derived, writable, type Readable } from 'svelte/store';

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

const createState = () => {
	const key = `state-${git.hash}`;

	let init: State = { view: ViewKind.table, theme: ThemeKind.light };
	if (browser) {
		try {
			init = { ...init, ...JSON.parse(localStorage.getItem(key) || '{}') };
		} catch (_) {}
	}

	const store = writable(init);
	if (browser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
			document.documentElement.className = ThemeKind[value.theme];
		});
	}

	return store;
};

export const state = createState();

export const url: Readable<URL> = derived([navigating, page], ([$navigating, $page], set) => {
	// this, to immediately show where they're navigating to, so navigating seems instantaneous
	set($navigating?.to?.url ?? $page.url);
});
