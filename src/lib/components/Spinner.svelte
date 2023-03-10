<script lang="ts">
	import { navigating } from '$app/stores';

	export let tag = 'div';
	export let text: string | undefined = undefined;
	$: default_ = $navigating ? 'Loading page' : 'Loading data';
</script>

<svelte:element this={tag} class="relative h-65vh">
	<div class="absolute-center flex flex-col items-center">
		<div class="spinner" />
		<span class="mt-4">{text ?? default_}</span>
	</div>
</svelte:element>

<style>
	/* taken from https://loading.io/css/ */
	.spinner {
		display: inline-block;
		position: relative;
		width: 160px;
		height: 160px;
	}

	.spinner:after {
		content: ' ';
		display: block;
		border-radius: 50%;
		margin: 16px;
		border: 64px solid;
		border-color: currentColor transparent;
		animation: spin 1.6s infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		}
		50% {
			transform: rotate(900deg);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		100% {
			transform: rotate(1800deg);
		}
	}
</style>
