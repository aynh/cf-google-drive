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
	class="w-full h-full flex flex-col items-center justify-center text-center p-2 lg:p-4"
>
	<GridViewItemIcon {value} />
	<span class="break-words line-clamp-2 w-full">{name}</span>
</a>

<style>
	/* .thumbnail-icon is in GridViewItemIcon.svelte */
	a:hover :global(.thumbnail-icon) {
		--uno: 'opacity-25';
	}
</style>
