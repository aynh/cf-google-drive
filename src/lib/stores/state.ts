import { browser } from '$app/environment';
import { navigating, page } from '$app/stores';
import { git } from '$lib/constants';
import { derived, writable, type Readable } from 'svelte/store';

export enum ViewKind {
	gallery,
	grid,
	table,
}

export enum ThemeKind {
	dark,
	light,
	'breeze-dark',
	'breeze-light',
	'github-dark',
	'github-light',
	'solarized-dark',
	'solarized-light',
}

export interface State {
	view: ViewKind;
	theme: ThemeKind;
}

const createState = () => {
	const key = `state-${git.hash}`;

	let init: State = { view: ViewKind.table, theme: ThemeKind.dark };
	if (browser) {
		try {
			init = { ...init, ...JSON.parse(localStorage.getItem(key) || '{}') };
		} catch (_) {}
	}

	const store = writable(init);
	if (browser) {
		const classes = (
			Object.values(ThemeKind).filter((value) => typeof value === 'string') as string[]
		).flatMap((value) => value.split('-'));

		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));

			document.documentElement.classList.remove(...classes);
			document.documentElement.classList.add(...ThemeKind[value.theme].split('-'));
		});
	}

	return store;
};

export const state = createState();

export const url: Readable<URL> = derived([navigating, page], ([$navigating, $page], set) => {
	// this, to immediately show where they're navigating to, so navigating seems instantaneous
	set($navigating?.to?.url ?? $page.url);
});
