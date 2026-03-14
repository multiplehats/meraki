<script lang="ts">
	import type { ProductListItem } from '$lib/features/products/types';
	import { formatPrice } from '$lib/features/products/types';
	import { urlFor } from '$lib/sanity/lib/image';
	import { useModals } from '$lib/components/modal-stack/modal-stack-provider.svelte';

	let { charms }: { charms: ProductListItem[] } = $props();

	const modals = useModals();

	function openQuickView(product: ProductListItem) {
		modals.push('productQuickView', { props: { product } });
	}
</script>

{#if charms.length > 0}
	<section class="mt-16" aria-labelledby="charms-heading">
		<h2 id="charms-heading" class="text-lg font-medium text-gray-900">Add a charm</h2>
		<p class="mt-1 text-sm text-gray-500">Customise your bag with a handmade crochet charm.</p>

		<div class="mt-4 overflow-x-auto">
			<div class="flex gap-4 pb-4" style="width: max-content;">
				{#each charms as charm (charm._id)}
					{@const imageUrl = charm.images[0]
						? urlFor(charm.images[0]).width(160).height(160).fit('crop').url()
						: null}
					<button
						type="button"
						onclick={() => openQuickView(charm)}
						class="group flex w-36 shrink-0 flex-col items-center gap-2 text-center"
					>
						<div
							class="size-36 overflow-hidden rounded-full bg-gray-100 transition-opacity group-hover:opacity-80"
						>
							{#if imageUrl}
								<img src={imageUrl} alt={charm.title} class="size-full object-cover" />
							{:else}
								<div class="size-full bg-gray-200"></div>
							{/if}
						</div>
						<span class="text-sm font-medium text-gray-900">{charm.title}</span>
						<span class="text-sm text-gray-500">{formatPrice(charm.price)}</span>
					</button>
				{/each}
			</div>
		</div>
	</section>
{/if}
