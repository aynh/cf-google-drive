<script lang="ts">
	import { page } from '$app/stores';
	import GenericFluid from '$lib/components/GenericFluid.svelte';
</script>

<GenericFluid>
	<div class="i-lucide-slash text-red" />
	<span slot="text" class="text-red">{$page.status} | {$page.error?.message}</span>
</GenericFluid>
