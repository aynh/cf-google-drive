<script lang="ts">
	interface Data {
		folder: boolean;
		name: string;
		modified: string;
		path: string;
		size?: number;
	}

	export let data: Data;
	$: reload = data.folder ? undefined : ('' as const);
	$: modified = data.modified.padStart(20);
	$: size = String(data.size ?? '-').padStart(20);
</script>

<span class="link">
	<a href={data.path} data-sveltekit-reload={reload}>{data.name}</a>
	<span>{modified}{size}</span>
</span>

<style>
	span.link {
		display: inline-flex;
		width: 100%;
	}

	span.link > a {
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 360px;
	}

	span.link > span {
		flex: 1;
		text-align: right;
	}
</style>
