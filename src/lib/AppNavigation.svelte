<script lang="ts">
	import { offset, shift } from '@floating-ui/dom';
	import { dropdown } from './utilities/dropdown';
	import { url } from './stores/state';

	$: ({ origin, pathname } = $url);
	$: paths = [origin, ...pathname.split('/').slice(1, -1)];
	$: title = decodeURIComponent(pathname === '/' ? origin : pathname);

	const { setDropdown, setDropdownToggle, show } = dropdown({
		middleware: [offset({ mainAxis: 1, crossAxis: 6 }), shift({ padding: 8 })],
		placement: 'bottom-end',
	});
</script>

<div class="{$$props.class} relative">
	<button
		use:setDropdownToggle
		on:click={() => ($show = !$show)}
		aria-label="Toggle navigation dropdown"
		class="w-full p-3 lt-md:py-2 lg:py-4 truncate font-semibold lt-md:text-sm border-r border-r-solid"
	>
		{title}
	</button>

	{#if $show}
		<nav
			use:setDropdown
			class="z-1 absolute inset-0 min-w-45vw w-90vw md:w-4/5 h-max max-h-80vh bgfg-alt overflow-y-auto rounded-b-lg border border-solid shadow-lg shadow-black/50"
		>
			<ol class="flex flex-col items-start divide-y">
				{#each paths as part, index}
					{@const href = paths.slice(0, index + 1).join('/')}
					<li class="w-full">
						<a
							{href}
							style:padding-left="{index}rem"
							class="flex items-center justify-around break-words py-2"
						>
							<div class:i-lucide-home={index === 0} class="w-8 h-8 i-lucide-folder" />
							<span class="break-words w-[calc(100%-4rem)]">
								{decodeURIComponent(part)}
							</span>
						</a>
					</li>
				{/each}
			</ol>
		</nav>
	{/if}
</div>
