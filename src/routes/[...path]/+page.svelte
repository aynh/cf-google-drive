<script lang="ts">
	import { page } from '$app/stores';
	import AppFooter from '$lib/AppFooter.svelte';
	import AppNavigation from '$lib/AppNavigation.svelte';
	import AppToggleState from '$lib/AppToggleState.svelte';
	import DynamicView from '$lib/components/views/DynamicView.svelte';
	import { decompact } from '$lib/utilities/compact';
	import { url } from '$lib/stores/state';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ pathname: path } = $url);
	$: promise = data.items.promise.then((values) => {
		const base = new URL($page.url);
		// ensure base ends with / to make new URL with base work as expected
		base.pathname = base.pathname.replace(/[^\/]$/, '$&/');

		return values.map(decompact).map((value) => ({
			...value,
			href: new URL(encodeURIComponent(value.name), base).href,
		}));
	});
</script>

<svelte:head>
	<title>{`Index of ${decodeURIComponent(path)}`}</title>
</svelte:head>

<div class="flex items-center justify-between bgfg-alt mb-1 lg:mb-2 border border-solid">
	<AppNavigation class="w-max max-w-1/2 md:max-w-2/3 lg:max-w-3/4" />
	<AppToggleState class="flex-1 max-w-1/2 md:max-w-1/3 lg:max-w-1/4" />
</div>

<DynamicView {promise} />

<AppFooter />
