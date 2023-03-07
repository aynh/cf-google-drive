<script lang="ts">
	import { sort, sorted, SortKey, SortOrder } from '$lib/stores/sort';
	import type { ViewComponentProperties } from '$lib/types';
	import Spinner from '$lib/components/Spinner.svelte';
	import GridVIewItem from './GridVIewItem.svelte';

	export let promise: ViewComponentProperties['promise'];

	const sortSelections = [SortKey.name, SortKey.modified, SortKey.size].flatMap((key) => {
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

<div class="border border-solid border-$text-main">
	<div
		class="flex justify-end bg-$background-alt border border-b-solid border-$text-main py-2 px-4"
	>
		<div>
			<label for="sort-by">sort by</label>
			<select
				bind:value={selectedSort}
				id="sort-by"
				class="bg-$background-main text-$text-main border border-$text-main"
			>
				{#each sortSelections as { name, value }}
					<option {value}> {name} </option>
				{/each}
			</select>
		</div>
	</div>

	{#await promise}
		<Spinner />
	{:then items}
		<ol
			class="list-none p-0 m-0 grid grid-auto-rows-[minmax(0,1fr)] grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
		>
			{#each $sorted(items) as value}
				<li>
					<GridVIewItem {value} />
				</li>
			{/each}
		</ol>
	{/await}
</div>
