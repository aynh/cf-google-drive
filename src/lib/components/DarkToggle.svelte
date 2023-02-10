<script lang="ts">
	let isDark = false;

	const toggleDark = () => {
		document.documentElement.classList.toggle('dark');
		isDark = document.documentElement.classList.contains('dark');
	};
</script>

<button
	aria-label="Toggle Dark mode"
	on:click={() => toggleDark()}
	class:i-lucide-moon={isDark}
	class:i-lucide-sun={!isDark}
	class="w-6 md:w-8 h-6 md:h-8 cursor-pointer"
/>
