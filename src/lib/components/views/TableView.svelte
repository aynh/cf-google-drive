<script lang="ts">
	import { sort, sorted, SortKey, SortOrder } from '$lib/stores/sort';
	import type { ViewComponentProperties } from '$lib/types';
	import Spinner from '$lib/components/Spinner.svelte';
	import TableViewRow from './TableViewRow.svelte';
	import TableViewHeader from './TableViewHeader.svelte';

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

<table class="table-fixed w-full text-sm text-left">
	<thead>
		<TableViewHeader
			on:key-click={handleKeyClick}
			values={[
				{ title: 'Name', key: SortKey.name },
				{ title: 'Last Modified', key: SortKey.modified },
				{ title: 'Size', key: SortKey.size },
			]}
		/>
	</thead>
	<tbody>
		{#await promise}
			<Spinner tag="tr" />
		{:then items}
			{#each $sorted(items) as value}
				<TableViewRow {value} />
			{/each}
		{/await}
	</tbody>
</table>

<style lang="less">
	table,
	thead,
	tbody {
		--uno: 'lt-lg:block';
	}

	table {
		--uno: 'border-collapse';

		> :global(thead) > :global(tr) {
			--uno: 'border-solid';
		}

		> :global(tbody) > :global(tr) {
			--uno: 'border-solid border-t-none';
		}

		:global(tr) {
			--uno: 'lt-lg:flex border';

			> :global(:where(.name-row, .modified-row)) {
				--uno: 'border border-r-solid';
			}

			> :global(:where(td, th)) {
				--uno: 'px-3 md:px-5 lg:px-6 py-2 md:py-3';
			}

			> :global(.name-row) {
				--uno: 'lt-md:w-7/10 lt-lg:w-4/5 truncate';
			}

			> :global(.modified-row) {
				--uno: 'lt-lg:hidden lg:w-15%';
			}

			> :global(.size-row) {
				--uno: 'lg:w-10% lt-lg:flex-1';
			}
		}
	}
</style>
