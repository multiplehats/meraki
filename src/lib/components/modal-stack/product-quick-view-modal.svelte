<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import * as Dialog from '$lib/components/ui/dialog';
	import { cart } from '$lib/features/cart/store.svelte';
	import { formatPrice, stockStatus } from '$lib/features/products/types';
	import type { ProductListItem } from '$lib/features/products/types';
	import { urlFor } from '$lib/sanity/lib/image';
	import { toast } from 'svelte-sonner';

	type ProductQuickViewResult = { added: boolean };

	type Props = StackItemProps<ProductQuickViewResult> & {
		product: ProductListItem;
	};

	let { item, product }: Props = $props();

	const stock = $derived(stockStatus(product));
	const imageUrl = $derived(
		product.images[0] ? urlFor(product.images[0]).width(600).height(800).fit('crop').url() : null
	);

	function handleOpenChange(open: boolean) {
		if (!open) item.resolve({ added: false });
	}

	function handleAddToBag() {
		cart.addItem({
			productId: product._id,
			slug: product.slug.current,
			title: product.title,
			price: product.price,
			qty: 1,
			stock: product.stock,
			imageUrl: imageUrl ?? '',
			isDigital: product.category?.isDigital ?? false
		});
		toast.success('Added to cart', { description: product.title });
		item.resolve({ added: true });
	}
</script>

<Dialog.Root open={true} onOpenChange={handleOpenChange}>
	<Dialog.Content
		class="flex w-full max-w-4xl gap-0 overflow-hidden p-0 sm:max-w-2xl lg:max-w-4xl"
		showCloseButton={false}
	>
		<!-- Close button positioned absolutely -->
		<Dialog.Close
			class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
		>
			<span class="sr-only">Close</span>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				aria-hidden="true"
				class="size-6"
			>
				<path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</Dialog.Close>

		<div
			class="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 p-6 sm:grid-cols-12 md:p-8 lg:items-center lg:gap-x-8"
		>
			<!-- Product image -->
			{#if imageUrl}
				<img
					src={imageUrl}
					alt={product.title}
					class="aspect-2/3 w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
				/>
			{:else}
				<div class="aspect-2/3 w-full rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5"></div>
			{/if}

			<!-- Product details -->
			<div class="sm:col-span-8 lg:col-span-7">
				<h2 class="text-xl font-medium text-gray-900 sm:pr-12">{product.title}</h2>

				<section aria-labelledby="qv-information-heading" class="mt-2">
					<h3 id="qv-information-heading" class="sr-only">Product information</h3>

					<p class="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>

					{#if product.category}
						<p class="mt-1 text-sm text-gray-500">{product.category.name}</p>
					{/if}

					<div class="mt-3">
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {stock.available
								? 'bg-emerald-50 text-emerald-700'
								: 'bg-red-50 text-red-700'}"
						>
							{stock.label}
						</span>
					</div>
				</section>

				<section class="mt-8">
					<button
						type="button"
						onclick={handleAddToBag}
						disabled={!stock.available}
						class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
					>
						{stock.available ? 'Add to bag' : 'Out of stock'}
					</button>

					<p class="mt-6 text-center text-sm">
						<a
							href="/products/{product.slug.current}"
							class="font-medium text-indigo-600 hover:text-indigo-500"
						>
							View full details &rarr;
						</a>
					</p>
				</section>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
