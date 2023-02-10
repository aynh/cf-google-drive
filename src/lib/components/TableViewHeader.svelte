<script lang="ts">
	import type { SortOptions } from '$lib/stores/sort';
	import { createEventDispatcher } from 'svelte';

	interface HeaderValue {
		title: string;
		key: SortOptions['key'];
	}

	export let values: HeaderValue[];

	const dispatch = createEventDispatcher<{ 'key-click': SortOptions['key'] }>();
</script>

<tr class="text-xs bg-$background-alt">
	{#each values as { title, key }}
		<th scope="col" class={`${key}-row`}>
			<button
				on:click={() => dispatch('key-click', key)}
				title={`Sort by ${title.toLowerCase()}`}
				class="uppercase inline-flex items-center border-none color-inherit bg-inherit hover:cursor-pointer"
			>
				{title}
				<span class="i-lucide-chevrons-up-down w-3 h-3 ml-1" />
			</button>
		</th>
	{/each}
</tr>
