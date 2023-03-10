<script>
	import AppFooter from '$lib/AppFooter.svelte';
	import AppNavigation from '$lib/AppNavigation.svelte';
	import AppToggleState from '$lib/AppToggleState.svelte';

	import '$lib/css/main.less';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.bunny.net" />
	<link href="https://fonts.bunny.net/css?family=abeezee:400" rel="stylesheet" />
</svelte:head>

<div class="flex items-center justify-between bgfg-alt mb-1 lg:mb-2 border border-solid">
	<AppNavigation class="w-max max-w-1/2 md:max-w-2/3 lg:max-w-3/4" />
	<AppToggleState class="flex-1 max-w-1/2 md:max-w-1/3 lg:max-w-1/4" />
</div>

<div class="border border-solid bgfg-main">
	<slot />
</div>

<AppFooter />

<style uno:preflights global>
	body {
		font-family: 'ABeeZee', sans-serif;
	}
</style>
