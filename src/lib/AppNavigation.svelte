<script lang="ts">
	import { page } from '$app/stores';
	import { offset, shift } from '@floating-ui/dom';
	import { dropdown } from './dropdown';

	$: ({ origin, pathname } = $page.url);
	$: paths = [origin, ...pathname.split('/').slice(1, -1)];
	$: title = decodeURIComponent(pathname === '/' ? origin : pathname);

	const { setDropdown, setDropdownToggle, show } = dropdown({
		middleware: [offset({ mainAxis: 6, crossAxis: 6 }), shift({ padding: 8 })],
		placement: 'bottom-end',
	});
</script>

<div class="{$$props.class} relative border-r border-r-solid border-r-$text-main">
	<button
		use:setDropdownToggle
		on:click={() => show.toggle()}
		aria-label="Toggle navigation dropdown"
		class="w-full p-3 lt-md:py-2 lt-lg:py-4 rounded-none bg-$background-alt hover:bg-$background-focus text-$text-main border-0 cursor-pointer truncate font-semibold text-sm md:text-base"
	>
		{title}
	</button>

	{#if $show}
		<nav
			use:setDropdown
			class="z-1 absolute inset-0 min-w-45vw w-90vw md:w-4/5 h-max max-h-80vh bg-$background-alt overflow-y-auto rounded-b-lg border border-solid shadow-lg shadow-black/50"
		>
			<ol class="list-none flex flex-col items-start my-0 p-0 divide-y divide-$text-focus">
				{#each paths as part, index}
					<li class="w-full">
						<a
							style:padding-left="{index}rem"
							href={paths.slice(0, index + 1).join('/')}
							class="flex items-center justify-around text-$text-main hover:bg-$background-focus no-underline hover:underline break-words py-2"
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
