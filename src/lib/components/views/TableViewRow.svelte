<script lang="ts">
	import prettyBytes from 'pretty-bytes';
	import type { FileValue } from '$lib/types';
	import { FileType } from '$lib/filetype';

	export let value: FileValue;
	$: ({ href, modified, name, size, type } = value);
	$: bytes = size < 0 ? '-' : prettyBytes(size);
</script>

<tr class="hover:bg-$background-focus">
	<th scope="row" class="name-row">
		<a
			{href}
			class="text-$text-focus"
			data-sveltekit-reload={type === FileType.folder ? undefined : ''}
			title={name}
		>
			{name}
		</a>
	</th>
	<td class="modified-row"> {modified} </td>
	<td class="size-row"> {bytes} </td>
</tr>

<style>
	tr > :where(td, th) {
		--uno: 'lg:py-4';
	}
</style>
