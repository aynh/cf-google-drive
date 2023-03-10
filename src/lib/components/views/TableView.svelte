<script lang="ts">
	import { sort, sorted, SortKey, SortOrder } from '$lib/stores/sort';
	import type { ViewComponentProperties } from '$lib/types';
	import EmptyFolder from '$lib/components/EmptyFolder.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import TableViewHeaderRow from './TableViewHeaderRow.svelte';
	import TableViewRow from './TableViewRow.svelte';

	export let promise: ViewComponentProperties['promise'];

	const handleKeyClick = ({ detail: key }: CustomEvent<SortKey>) => {
		$sort = {
			key,
			order:
				$sort.key === key && $sort.order === SortOrder.ascending
					? // interchange between ascending and descending
					  SortOrder.descending
					: SortOrder.ascending,
		};
	};
</script>

<table class="table-fixed border-collapse w-full text-sm">
	<thead>
		<TableViewHeaderRow on:key-click={handleKeyClick} />
	</thead>
	<tbody class="divide-y">
		{#await promise}
			<Spinner tag="tr" />
		{:then items}
			{#if items.length === 0}
				<EmptyFolder tag="tr" />
			{:else}
				{#each $sorted(items) as value}
					<TableViewRow {value} />
				{/each}
			{/if}
		{/await}
	</tbody>
</table>

<style lang="less">
	:where(table, thead, tbody) {
		--uno: 'lt-lg:block';
	}

	table {
		:global(tr) {
			--uno: 'lt-lg:flex divide-x';
		}

		:global(:where(td, th)) {
			--uno: 'px-3 md:px-5 lg:px-6 py-2 md:py-3 lg:py-4';
		}

		:global(.name-row) {
			--uno: 'lt-md:w-70% lt-lg:w-80%';
		}

		:global(.modified-row) {
			--uno: 'lt-lg:hidden w-18%';
		}

		:global(.size-row) {
			--uno: 'lg:w-10% flex-1';
		}
	}
</style>
