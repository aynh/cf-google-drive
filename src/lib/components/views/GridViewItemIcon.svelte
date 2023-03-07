<script lang="ts">
	import type { FileValue } from '$lib/types';
	import FileTypeIcon from '$lib/components/FileTypeIcon.svelte';

	export let value: FileValue;
	$: ({ href, name, thumbnail, type } = value);

	let imageLoaded = false; // show a placeholder if image is not loaded
</script>

<div class="icon relative w-24 md:w-36 h-24 md:h-36">
	{#if thumbnail}
		<img
			on:load={() => (imageLoaded = true)}
			loading="lazy"
			src="{href}?thumbnail"
			alt="{name} thumbnail"
			class:opacity-0={!imageLoaded}
			class="object-cover"
		/>

		{#if !imageLoaded}
			<div class="bg-$background-alt animate-pulse">
				<div class="absolute-center text-$text-alt h-1/2 w-1/2 i-lucide-image" />
			</div>
		{/if}

		<div
			class="thumbnail-icon transition-opacity-200 absolute bottom-0 left-0 bg-$background-focus h-3/10 w-3/10 p-1 rounded-tr-lg rounded-bl-lg"
		>
			<FileTypeIcon {type} class="h-full w-full" />
		</div>
	{:else}
		<FileTypeIcon {type} />
	{/if}
</div>

<style>
	.icon > :global(:not(.thumbnail-icon)) {
		--uno: 'absolute inset-0 h-inherit w-inherit rounded-lg';
	}

	.icon:hover > :global(.thumbnail-icon) {
		--uno: 'opacity-0';
	}
</style>
