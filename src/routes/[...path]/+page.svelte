<script lang="ts">
	import type { PageData } from './$types';
	import AppFooter from '$lib/AppFooter.svelte';
	import AppNavigation from '$lib/AppNavigation.svelte';
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
	class="flex items-center justify-between bg-$background-alt mb-1 lg:mb-2 border border-solid border-$text-main"
>
	<AppNavigation class="w-max max-w-1/2 md:max-w-2/3 lg:max-w-3/4" />
	<AppToggleState class="flex-1 max-w-1/2 md:max-w-1/3 lg:max-w-1/4" />
</div>

<svelte:component this={$View} {promise} />

<AppFooter />
