<script lang="ts">
	import { renderStudio } from 'sanity';
	import config from '../../../../sanity.config';

	let container: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!container) return;
		const cleanup = renderStudio(container, config);
		return cleanup ?? undefined;
	});
</script>

<svelte:head>
	<title>Merak'i Studio</title>
</svelte:head>

<div bind:this={container} style="height: 100vh;"></div>
