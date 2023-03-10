<script lang="ts">
	export let tag = 'div';
</script>

<svelte:element this={tag} class="relative h-65vh">
	<div class="absolute-center flex flex-col items-center">
		<div class="i-lucide-citrus w-32 h-32" />
		<span class="mt-4"> This folder is empty. </span>
	</div>
</svelte:element>
