<script lang="ts">
	import type { PageData } from './$types';
	import AppFooter from '$lib/AppFooter.svelte';
	import AppToggleState from '$lib/AppToggleState.svelte';
	import { sort, __sortDefault } from '$lib/stores/sort';
	import { View } from '$lib/stores/state';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: PageData;
	$: ({ pathname: path } = $page.url);
	$: promise = data.promise.items.then((values) => {
		const base = new URL($page.url);
		// ensure base ends with / to make new URL with base work as expected
		base.pathname = base.pathname.replace(/[^\/]$/, '$&/');

		return values.map((value) => ({
			...value,
			href: new URL(value.name, base).href,
		}));
	});

	afterNavigate(() => {
		sort.set(__sortDefault);
	});
</script>

<svelte:head>
	<title>{`Index of ${decodeURIComponent(path)}`}</title>
</svelte:head>

<div
	class="flex space-x-2 items-center justify-between p-2 pr-3 bg-$background-alt mb-1 lg:mb-2 border border-solid border-$text-main"
>
	<div />
	<AppToggleState />
</div>

<svelte:component this={$View} {promise} />

<AppFooter />
