<script lang="ts">
	import { FileType } from '$lib/filetype';

	export let type: FileType;
</script>

<div
	class:i-lucide-file-archive={type === FileType.archive}
	class:i-lucide-file-audio={type === FileType.audio}
	class:i-lucide-folder={type === FileType.folder}
	class:i-lucide-file-image={type === FileType.image}
	class:i-lucide-file-bar-chart-2={type === FileType.presentation}
	class:i-lucide-file-spreadsheet={type === FileType.spreadsheet}
	class:i-lucide-file-text={type === FileType.text}
	class:i-lucide-file-video={type === FileType.video}
	class:i-lucide-file={type === FileType.unknown}
	class={$$props.class}
/>
