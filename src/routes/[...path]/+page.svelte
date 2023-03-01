<script lang="ts">
	import LinkItem from '$lib/LinkItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<h1>{data.title}</h1>
<hr />
<pre style:width="640px"><a href={data.parent}>../</a
	>{#await data.promise.items}{'\tLoading...'}{:then items}{#each items.sort( ({ name: a }, { name: b }) => a.localeCompare(b), ) as item}{'\n'}<LinkItem
				data={item}
			/>{/each}{/await}
</pre>
<hr />
