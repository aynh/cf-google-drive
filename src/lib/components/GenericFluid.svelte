<script lang="ts">
	export let tag = 'div';
</script>

<svelte:element this={tag} class="relative h-65vh">
	<div class="wrapper absolute-center flex flex-col items-center">
		<slot />
		<slot name="text" />
	</div>
</svelte:element>

<style>
	.wrapper > :global(*):first-child {
		--uno: 'w-32 h-32 mb-4';
	}
</style>
