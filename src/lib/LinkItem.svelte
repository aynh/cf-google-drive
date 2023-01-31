<script lang="ts">
	interface Data {
		folder: boolean;
		name: string;
		modified: string;
		path: string;
		size: number | undefined;
	}

	export let data: Data;
	$: reload = data.folder ? undefined : ('' as const);
	$: size = String(data.size ?? '-').padStart(20);
	$: details = `${data.modified}${size}`;
</script>

<span><a href={data.path} data-sveltekit-reload={reload}>{data.name}</a>{details}</span>

<style>
	span {
		display: inline flex;
		justify-content: space-between;
		width: 100%;
	}
</style>
