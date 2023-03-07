<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { sort, __sortDefault } from '$lib/stores/sort';
	import { state, ViewKind } from '$lib/stores/state';
	import type { ViewComponent, ViewComponentProperties } from '$lib/types';

	export let promise: ViewComponentProperties['promise'];

	// prevent "flash" when cycling between views
	let loaded: { [key in ViewKind]?: ViewComponent } = {};
	const importMap: Record<ViewKind, () => Promise<ViewComponent>> = {
		[ViewKind.grid]: () =>
			import('./GridView.svelte').then((it) => (loaded[ViewKind.grid] = it.default)),
		[ViewKind.table]: () =>
			import('./TableView.svelte').then((it) => (loaded[ViewKind.table] = it.default)),
	};

	$: componentPromise = Promise.resolve(loaded[$state.view]).then(
		(component) => component ?? importMap[$state.view](),
	);

	afterNavigate(() => {
		$sort = __sortDefault;
	});

	beforeNavigate(({ from, to }) => {
		if (from?.url.pathname !== to?.url.pathname && to?.params !== undefined) {
			// set promise to a promise that won't resolve to simulate a loading,
			// it will be replaced with the actual promise after navigation done
			promise = new Promise(() => {});
		}
	});
</script>

<div>
	{#await componentPromise}
		<Spinner class="border border-solid border-$text-main" text="Loading component..." />
	{:then component}
		<svelte:component this={component} {promise} />
	{/await}
</div>
