<script lang="ts">
	import { state, ThemeKind, ViewKind, type State } from '$lib/stores/state';
	import AppToggleStateDropdown from './AppToggleStateDropdown.svelte';

	type StateItem<T = keyof State, P = State> = T extends keyof P ? [T, Array<P[T]>] : never;

	const items = [
		['view', Object.values(ViewKind).filter((it) => typeof it === 'number')],
		['theme', Object.values(ThemeKind).filter((it) => typeof it === 'number')],
	] as StateItem[];

	const handleClick = <T extends keyof State>(type: T, value: State[T]) => {
		$state[type] = value;
	};
</script>

<div class="{$$props.class} relative flex justify-evenly py-1 md:py-1.5 lg:py-2">
	{#each items as [type, values]}
		{@const kind = type === 'theme' ? ThemeKind : ViewKind}
		<AppToggleStateDropdown name={type}>
			<ul class="flex flex-col space-y-1">
				{#each values as value}
					{@const name = kind[value]}
					<li>
						<button
							disabled={$state[type] === value}
							on:click={() => handleClick(type, value)}
							aria-label="Toggle {name} {type}"
							class="w-full flex space-x-1.5 items-center border border-solid disabled:border-dashed rounded-sm px-1"
						>
							<div class="{type}-{name}" />
							<span class="text-lg">{name}</span>
						</button>
					</li>
				{/each}
			</ul>
		</AppToggleStateDropdown>
	{/each}
</div>

<style lang="less">
	div :global(button) {
		--uno: 'capitalize text-sm md:text-lg md:font-semibold';
	}

	.view {
		&-grid {
			--uno: 'i-lucide-layout-grid';
		}

		&-table {
			--uno: 'i-lucide-list';
		}
	}

	.theme {
		&-light {
			--uno: 'i-lucide-sun';
		}

		&-dark {
			--uno: 'i-lucide-moon';
		}
	}
</style>
