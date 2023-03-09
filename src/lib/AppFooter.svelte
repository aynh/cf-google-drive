<script lang="ts">
	import { git } from './constants';
</script>

<footer
	class="flex lt-md:flex-col lt-md:space-y-4 lt-md:items-center md:justify-evenly pt-6 lg:pt-8 pb-4 lg:pb-6"
>
	<div>
		<span> Made with </span>
		<a rel="noreferrer" target="_blank" href="https://kit.svelte.dev"
			><div class="i-simple-icons-svelte" />
			<span> SvelteKit </span></a
		>
		<span> and </span>
		<a rel="noreferrer" target="_blank" href="https://github.com/unocss/unocss"
			><div class="i-simple-icons-unocss" />
			<span> UnoCSS </span></a
		>
	</div>
	<div>
		<span> Source code: </span>
		<a rel="noreferrer" target="_blank" href={`${git.origin}/tree/${git.hash}`}>
			<div class="i-simple-icons-github" />
			<span> {git.lastmod}-{git.hash.slice(0, 7)} </span>
		</a>
	</div>
</footer>

<style lang="less">
	footer > :global(div) {
		--uno: 'flex space-x-2';
	}

	a {
		--uno: 'flex underline';

		:global(div) {
			--uno: 'mr-1.5';
		}
	}
</style>
