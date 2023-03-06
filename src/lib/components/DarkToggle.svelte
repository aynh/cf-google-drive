<script lang="ts">
	import { state } from '$lib/stores/state';

	const toggleDark = () => {
		document.documentElement.classList.toggle('dark');
		$state.dark = document.documentElement.classList.contains('dark');
	};
</script>

<button
	aria-label="Toggle Dark mode"
	on:click={() => toggleDark()}
	class:i-lucide-moon={$state.dark}
	class:i-lucide-sun={!$state.dark}
	class="w-6 md:w-8 h-6 md:h-8 cursor-pointer"
/>
