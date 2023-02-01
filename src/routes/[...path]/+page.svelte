<script lang="ts">
	import LinkItem from '$lib/LinkItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: items = data.items.sort(({ name: a }, { name: b }) => a.localeCompare(b));
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<h1>{data.title}</h1>
<hr />
<pre style:width="640px"><a href={data.parent}>../</a>{#each items as item}{'\n'}<LinkItem
			data={item}
		/>{/each}
</pre>
<hr />
