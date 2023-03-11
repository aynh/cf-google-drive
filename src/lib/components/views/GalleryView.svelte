<script lang="ts">
	import { FileType } from '$lib/filetype';
	import type { ViewComponentProperties } from '$lib/types';
	import Spinner from '../Spinner.svelte';

	export let promise: ViewComponentProperties['promise'];

	const images = (items: Awaited<ViewComponentProperties['promise']>) => {
		return items
			.map(({ thumbnail, ...rest }) => {
				const [height, width] = Array.isArray(thumbnail) ? thumbnail : [0, 0];
				return { height, width, ...rest };
			})
			.filter(({ height, width, type }) => type === FileType.image && height !== 0 && width !== 0);
	};
</script>

<div>
	{#await promise}
		<Spinner />
	{:then items}
		<!-- gallery implementation from https://github.com/xieranmaya/blog/issues/6 -->
		<div class="flex flex-wrap m-1 gap-1 after:content-[''] after:flex-grow-999999">
			{#each images(items) as { height, href, name, width }}
				<a
					{href}
					style:width="{(width * 200) / height}px"
					style:flex-grow={(width * 200) / height}
					class="relative"
				>
					<div style:padding-bottom="{(height / width) * 100}%" />
					<img src="{href}?thumbnail" alt={name} class="absolute w-full top-0 align-bottom" />
				</a>
			{/each}
		</div>
	{/await}
</div>
