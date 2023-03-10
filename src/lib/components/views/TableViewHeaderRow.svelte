<script lang="ts">
	import { SortKey } from '$lib/stores/sort';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ 'key-click': SortKey }>();
	const headers = [
		['Name', SortKey.name],
		['Last Modified', SortKey.modified],
		['Size', SortKey.size],
	] as const;
</script>

<tr class="lt-lg:text-xs bgfg-alt border border-b-solid">
	{#each headers as [title, key]}
		<th scope="col" class={`${SortKey[key]}-row`}>
			<button
				on:click={() => dispatch('key-click', key)}
				title={`Sort by ${title.toLowerCase()}`}
				class="uppercase inline-flex items-center"
			>
				{title}
				<span class="i-lucide-chevrons-up-down w-3 h-3 ml-1" />
			</button>
		</th>
	{/each}
</tr>
