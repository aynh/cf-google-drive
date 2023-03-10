<script lang="ts">
	import { FileType } from '$lib/filetype';
	import type { FileValue } from '$lib/types';
	import GridViewItemIcon from './GridViewItemIcon.svelte';

	export let value: FileValue;
	$: ({ href, name, type } = value);
</script>

<a
	{href}
	title={name}
	data-sveltekit-reload={type === FileType.folder ? undefined : ''}
	class="w-full h-full flex flex-col items-center text-center p-2 lg:p-4"
>
	<GridViewItemIcon {value} />
	<div class="flex flex-1 items-center justify-center w-full">
		<span class="break-words line-clamp-2">{name}</span>
	</div>
</a>

<style>
	/* .thumbnail-icon is in GridViewItemIcon.svelte */
	a:hover :global(.thumbnail-icon) {
		--uno: 'opacity-50';
	}
</style>
