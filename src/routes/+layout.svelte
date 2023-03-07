<script>
	import '$lib/css/main.less';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.bunny.net" />
	<link href="https://fonts.bunny.net/css?family=abeezee:400" rel="stylesheet" />
</svelte:head>

<slot />

<style uno:preflights global>
	body {
		font-family: 'ABeeZee', sans-serif;
	}
</style>
