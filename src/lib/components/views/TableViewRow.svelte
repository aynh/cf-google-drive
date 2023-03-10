<script lang="ts">
	import prettyBytes from 'pretty-bytes';
	import type { FileValue } from '$lib/types';
	import { FileType } from '$lib/filetype';

	export let value: FileValue;
	$: ({ href, modified, name, size, type } = value);
	$: bytes = Number.isNaN(size) ? '-' : prettyBytes(size);
	$: isFolder = type === FileType.folder;
</script>

<tr class="hover:bgfg-focus hover:divide-$fg-focus">
	<th scope="row" class="name-row truncate">
		<a {href} data-sveltekit-reload={isFolder ? undefined : ''} title={name}>
			{isFolder ? `${name}/` : name}
		</a>
	</th>
	<td class="modified-row"> {modified} </td>
	<td class="size-row"> {bytes} </td>
</tr>
