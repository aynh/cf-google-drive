<script lang="ts">
	import { offset, shift } from '@floating-ui/dom';
	import { dropdown } from './dropdown';

	export let name: string;

	const { setDropdown, setDropdownToggle, show } = dropdown({
		middleware: [offset({ mainAxis: 8 }), shift()],
		placement: 'bottom-end',
	});
</script>

<div>
	<button
		use:setDropdownToggle
		on:click={() => show.toggle()}
		aria-label="Toggle {name} dropdown"
		class="flex lt-md:flex-row-reverse items-center -space-x-0.5 md:space-x-0.5 border border-solid ring-$text-focus focus:ring-2 rounded-lg py-1 px-2 md:px-3"
	>
		<span> {name} </span>
		<div class="i-lucide-chevron-down" />
	</button>

	{#if $show}
		<div
			use:setDropdown
			class="z-1 absolute left-0 top-0 bg-$background-main rounded-lg p-1 md:p-1.5 ring-3 ring-$text-main shadow-lg shadow-black/50"
		>
			<slot />
		</div>
	{/if}
</div>
