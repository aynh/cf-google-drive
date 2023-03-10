<script lang="ts">
	import { sort, sorted, SortKey, SortOrder } from '$lib/stores/sort';
	import type { ViewComponentProperties } from '$lib/types';
	import EmptyFolder from '$lib/components/EmptyFolder.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import GridVIewItem from './GridVIewItem.svelte';

	export let promise: ViewComponentProperties['promise'];

	const sorts = [SortKey.name, SortKey.modified, SortKey.size].flatMap((key) => {
		return [SortOrder.ascending, SortOrder.descending].map((order) => {
			return { name: `${SortKey[key]} (${SortOrder[order]})`, value: `${key}|${order}` };
		});
	});

	let selectedSort = `${$sort.key}|${$sort.order}`;
	$: {
		const [key, order] = selectedSort.split('|').map(Number);
		$sort = { key, order };
	}
</script>

<div>
	<div class="flex justify-end bgfg-alt border border-b-solid py-2 px-4">
		<div>
			<label for="sort-by">sort by</label>
			<select bind:value={selectedSort} id="sort-by" class="bgfg-main p-1 border border-solid">
				{#each sorts as { name, value }}
					<option {value}> {name} </option>
				{/each}
			</select>
		</div>
	</div>

	{#await promise}
		<Spinner />
	{:then items}
		{#if items.length === 0}
			<EmptyFolder />
		{:else}
			<ol class="grid grid-auto-rows-[minmax(0,1fr)] grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{#each $sorted(items) as value}
					<li>
						<GridVIewItem {value} />
					</li>
				{/each}
			</ol>
		{/if}
	{/await}
</div>
