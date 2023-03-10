<script lang="ts">
	import { page } from '$app/stores';
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

<DynamicView {promise} />
