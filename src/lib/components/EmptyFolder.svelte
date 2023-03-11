<script lang="ts">
	import GenericFluid from './GenericFluid.svelte';

	export let tag = 'div';
</script>

<GenericFluid {tag}>
	<div class="i-lucide-citrus" />
	<span slot="text">This folder is empty.</span>
</GenericFluid>
