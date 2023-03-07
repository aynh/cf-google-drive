<script lang="ts">
	import { state, ThemeKind, ViewKind, type State } from '$lib/stores/state';
	import AppToggleStateDropdown from './AppToggleStateDropdown.svelte';

	type Item<T extends keyof State = keyof State> = [T, Array<State[T]>];

	const items = [
		['view', [ViewKind.grid, ViewKind.table]],
		['theme', [ThemeKind.dark, ThemeKind.light]],
	] as Item[];

	const handleClick = <T extends keyof State>(type: T, value: State[T]) => {
		$state[type] = value;
		if (type === 'theme') {
			document.documentElement.className = ThemeKind[value];
		}
	};
</script>

<div class="{$$props.class} relative toggle-state flex justify-evenly py-1 md:py-1.5 lg:py-2">
	{#each items as [name, values]}
		{@const type = name === 'theme' ? ThemeKind : ViewKind}
		<AppToggleStateDropdown {name}>
			<ul class="list-none p-0 my-0 flex flex-col space-y-1">
				{#each values as value}
					{@const key = type[value]}
					<li>
						<button
							disabled={$state[name] === value}
							on:click={() => handleClick(name, value)}
							aria-label="Toggle {key} {name}"
							class="w-full flex space-x-1 items-center border border-solid disabled:border-dashed border-$text-alt rounded-sm px-1"
						>
							<div class="{key}-icon" />
							<span class="text-lg">{key}</span>
						</button>
					</li>
				{/each}
			</ul>
		</AppToggleStateDropdown>
	{/each}
</div>

<style lang="less">
	.toggle-state :global(button) {
		--uno: 'capitalize text-sm md:text-lg md:font-semibold bg-$background-alt hover:not-disabled:bg-$background-focus text-$text-main disabled:text-$text-alt hover:not-disabled:text-$text-focus not-disabled:cursor-pointer';
	}

	.dark-icon {
		--uno: 'i-lucide-moon';
	}

	.grid-icon {
		--uno: 'i-lucide-layout-grid';
	}

	.light-icon {
		--uno: 'i-lucide-sun';
	}

	.table-icon {
		--uno: 'i-lucide-list';
	}
</style>
