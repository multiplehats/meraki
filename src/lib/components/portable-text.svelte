<script lang="ts">
	import { PortableText } from '@portabletext/svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { value }: { value: any[] } = $props();
</script>

<div class="prose prose-sm max-w-none text-gray-500">
	<PortableText {value} />
</div>
