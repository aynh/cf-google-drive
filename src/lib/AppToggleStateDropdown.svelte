<script lang="ts">
	import { offset, shift } from '@floating-ui/dom';
	import { dropdown } from './utilities/dropdown';

	export let name: string;

	const { setDropdown, setDropdownToggle, show } = dropdown({
		middleware: [offset({ mainAxis: 8 }), shift()],
		placement: 'bottom-end',
	});
</script>

<div>
	<button
		use:setDropdownToggle
		on:click={() => ($show = !$show)}
		aria-label="Toggle {name} dropdown"
		class="flex md:flex-row-reverse items-center space-x-0.5 md:space-x-1 md:space-x-reverse border md:border-solid ring-current rounded-lg py-1 px-2 md:px-3"
	>
		<div class="i-lucide-chevron-down" />
		<span> {name} </span>
	</button>

	{#if $show}
		<div
			use:setDropdown
			class="z-1 absolute left-0 top-0 bgfg-main rounded-lg p-1 md:p-1.5 ring-3 ring-current shadow-lg shadow-black/50"
		>
			<slot />
		</div>
	{/if}
</div>
