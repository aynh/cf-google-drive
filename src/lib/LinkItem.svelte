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
	$: paddedModified = data.modified.padStart(68 - data.name.length);
	$: paddedSize = String(data.size ?? '-').padStart(20);
	$: details = `${paddedModified}${paddedSize}`;
</script>

<a href={data.path} data-sveltekit-reload={reload}>{data.name}</a>{details}
