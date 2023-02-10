<script lang="ts">
	import type { PageData } from './$types';
	import DarkToggle from '$lib/components/DarkToggle.svelte';
	import TableView from '$lib/components/TableView.svelte';
	import { sort, __sortDefault } from '$lib/stores/sort';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: PageData;

	afterNavigate(() => {
		sort.set(__sortDefault);
	});
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div
	class="flex space-x-2 items-center justify-between p-2 pr-3 bg-$background-alt mb-1 lg:mb-2 border border-solid border-$text-main"
>
	<div />
	<DarkToggle />
</div>

<TableView promise={data.promise.items} />
