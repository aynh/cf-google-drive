<script lang="ts">
	import type { FileValue } from '$lib/types';
	import GridViewItemIcon from './GridViewItemIcon.svelte';

	export let value: FileValue;
	$: ({ folder, name, path } = value);
</script>

<a
	href={path}
	title={name}
	data-sveltekit-reload={folder ? undefined : ''}
	class="w-full h-full flex flex-col items-center justify-center text-center text-$text-main hover:text-$text-focus decoration-none hover:underline bg-$background-main hover:bg-$background-focus p-2 lg:p-4"
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
