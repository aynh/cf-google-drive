<script lang="ts">
	import { sort, sorted, type SortOptions } from '$lib/stores/sort';
	import type { FileValue } from '$lib/types';
	import Spinner from '$lib/components/Spinner.svelte';
	import GridVIewItem from './GridVIewItem.svelte';

	export let promise: Promise<FileValue[]>;

	const sortSelections = (['name', 'modified', 'size'] satisfies Array<SortOptions['key']>).flatMap(
		(key) => {
			return (['ascending', 'descending'] satisfies Array<SortOptions['order']>).map((order) => {
				return { name: `${key} (${order})`, value: `${key}|${order}` };
			});
		},
	);

	let selectedSort = `${$sort.key}|${$sort.order}`;
	$: {
		const [key, order] = selectedSort.split('|');
		$sort = { key, order } as SortOptions;
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
		<Spinner text="Loading data" />
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
