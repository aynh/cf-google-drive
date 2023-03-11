<script lang="ts">
	import type { FileValue } from '$lib/types';
	import FileTypeIcon from '$lib/components/FileTypeIcon.svelte';

	export let value: FileValue;
	$: ({ href, name, thumbnail, type } = value);

	let imageLoaded = false; // show a placeholder if image is not loaded
</script>

<div class:mb-1.5={thumbnail} class="icon relative w-24 md:w-36 h-24 md:h-36">
	{#if thumbnail !== false}
		<img
			on:load={() => (imageLoaded = true)}
			loading="lazy"
			src="{href}?thumbnail"
			alt="{name} thumbnail"
			class:opacity-0={!imageLoaded}
			class="object-cover"
		/>

		{#if !imageLoaded}
			<div class="bgfg-alt animate-pulse">
				<div class="absolute-center h-1/2 w-1/2 i-lucide-image" />
			</div>
		{/if}

		<div
			class="thumbnail-icon transition-opacity-200 absolute bottom-0 left-0 bgfg-focus h-3/10 w-3/10 p-1 rounded-tr-lg"
		>
			<FileTypeIcon {type} class="h-full w-full" />
		</div>
	{:else}
		<FileTypeIcon {type} />
	{/if}
</div>

<style lang="less">
	.icon {
		> :global(:not(.thumbnail-icon)) {
			--uno: 'absolute inset-0 h-inherit w-inherit rounded-lg';
		}

		&:hover > :global(.thumbnail-icon) {
			--uno: 'opacity-0';
		}
	}
</style>
