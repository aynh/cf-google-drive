import { beforeNavigate } from '$app/navigation';
import { computePosition } from '@floating-ui/dom';
import { onMount, tick } from 'svelte';
import type { Action } from 'svelte/action';
import { writable } from 'svelte/store';

export const dropdown = (options?: Parameters<typeof computePosition>[2]) => {
	const { set, subscribe } = writable(false);

	let dropdown: HTMLElement;
	const setDropdown = ((node) => {
		dropdown = node;
	}) satisfies Action;

	let dropdownToggle: HTMLElement;
	const setDropdownToggle = ((node) => {
		dropdownToggle = node;
	}) satisfies Action;

	beforeNavigate(() => {
		set(false);
	});

	let show = false;
	onMount(() => {
		const unsubscribe = subscribe(async (value) => {
			show = value;
			if (show) {
				await tick();
				const { x, y } = await computePosition(dropdownToggle, dropdown, options);
				dropdown.style.transform = `translate(${x}px, ${y}px)`;
			}
		});

		// hide dropdown on click outside
		const handleClick = (event: Event) => {
			if (show && event.target instanceof HTMLElement) {
				const { target } = event;
				if (!dropdown.contains(target) && !dropdownToggle.contains(target)) {
					set(false);
				}
			}
		};

		// hide dropdown on Escape key
		const handleKeyDown = (event: KeyboardEvent) => {
			if (show && event.code === 'Escape') {
				set(false);
			}
		};

		document.addEventListener('click', handleClick, true);
		document.addEventListener('keydown', handleKeyDown, true);

		return () => {
			unsubscribe();
			document.removeEventListener('click', handleClick, true);
			document.removeEventListener('keydown', handleKeyDown, true);
		};
	});

	return {
		setDropdown,
		setDropdownToggle,
		show: { set, subscribe, toggle: () => set(!show) },
	};
};
