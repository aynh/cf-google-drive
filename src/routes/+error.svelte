<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="relative h-65vh">
	<div class="absolute-center flex flex-col items-center">
		<div class="i-lucide-slash w-32 h-32 text-red" />
		<span class="mt-4"> {$page.status} | {$page.error?.message} </span>
	</div>
</div>
