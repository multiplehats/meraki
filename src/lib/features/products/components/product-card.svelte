<script lang="ts">
	import type { ProductListItem } from '$lib/features/products/types';
	import { formatPrice, stockStatus } from '$lib/features/products/types';
	import { urlFor } from '$lib/sanity/lib/image';
	import { useModals } from '$lib/components/modal-stack/modal-stack-provider.svelte';
	import { motionInView, animations } from '$lib/utils/motion';

	let { product }: { product: ProductListItem } = $props();

	const modals = useModals();
	const stock = $derived(stockStatus(product));
	const imageUrl = $derived(
		product.images[0] ? urlFor(product.images[0]).width(600).height(480).fit('crop').url() : null
	);

	function openQuickView(e: MouseEvent) {
		e.preventDefault();
		modals.push('productQuickView', { props: { product } });
	}
</script>

<div class="group relative" use:motionInView={animations.fadeInUp()}>
	<a href="/products/{product.slug.current}" class="block">
		<div class="relative aspect-5/4 overflow-hidden rounded-lg bg-gray-100">
			{#if imageUrl}
				<img
					src={imageUrl}
					alt={product.title}
					class="size-full object-cover transition-opacity duration-300 group-hover:opacity-75"
				/>
			{:else}
				<div class="size-full bg-gray-200"></div>
			{/if}

			<!-- Category badge -->
			{#if product.category}
				<span
					class="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-700"
				>
					{product.category.name}
				</span>
			{/if}

			<!-- Stock badge -->
			<span
				class="absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-medium {stock.available
					? 'bg-emerald-50 text-emerald-700'
					: 'bg-red-50 text-red-700'}"
			>
				{stock.label}
			</span>

			<!-- Quick view button -->
			<button
				type="button"
				onclick={openQuickView}
				class="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 py-2.5 text-sm font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
			>
				Quick view
			</button>
		</div>

		<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
			<h3 class="truncate">{product.title}</h3>
			<p class="ml-4 shrink-0">{formatPrice(product.price)}</p>
		</div>
	</a>
</div>
