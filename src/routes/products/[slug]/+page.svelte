<script lang="ts">
	import type { PageData } from './$types';
	import { formatPrice, stockStatus } from '$lib/features/products/types';
	import { urlFor } from '$lib/sanity/lib/image';
	import { cart } from '$lib/features/cart/store.svelte';
	import { toast } from 'svelte-sonner';
	import PortableText from '$lib/components/portable-text.svelte';
	import CharmScroll from '$lib/features/products/components/charm-scroll.svelte';

	let { data }: { data: PageData } = $props();

	const product = $derived(data.product);
	const stock = $derived(stockStatus(product));
	const mainImageUrl = $derived(
		product.images[0] ? urlFor(product.images[0]).width(800).height(640).fit('crop').url() : null
	);
	const galleryImages = $derived(
		product.images.slice(1, 3).map((img) => urlFor(img).width(400).height(400).fit('crop').url())
	);
	const isBag = $derived(product.category?.slug.current === 'bags');

	function addToCart() {
		cart.addItem({
			productId: product._id,
			slug: product.slug.current,
			title: product.title,
			price: product.price,
			qty: 1,
			imageUrl: mainImageUrl ?? '',
			isDigital: product.category?.isDigital ?? false
		});
		toast.success('Added to cart', {
			description: product.title
		});
	}
</script>

<div class="bg-white">
	<div class="pt-6 pb-16 sm:pb-24">
		<nav aria-label="Breadcrumb">
			<ol role="list" class="flex items-center space-x-4">
				<li>
					<div class="flex items-center">
						<a href="/products" class="mr-4 text-sm font-medium text-gray-900">Shop</a>
						<svg viewBox="0 0 6 20" aria-hidden="true" class="h-5 w-auto text-gray-300">
							<path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
						</svg>
					</div>
				</li>
				{#if product.category}
					<li>
						<div class="flex items-center">
							<a
								href="/products?category={product.category.slug.current}"
								class="mr-4 text-sm font-medium text-gray-900">{product.category.name}</a
							>
							<svg viewBox="0 0 6 20" aria-hidden="true" class="h-5 w-auto text-gray-300">
								<path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
							</svg>
						</div>
					</li>
				{/if}
				<li class="text-sm">
					<span aria-current="page" class="font-medium text-gray-500">{product.title}</span>
				</li>
			</ol>
		</nav>

		<div class="mt-8">
			<div class="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
				<div class="lg:col-span-5 lg:col-start-8">
					<div class="flex justify-between">
						<h1 class="text-xl font-medium text-gray-900">{product.title}</h1>
						<p class="text-xl font-medium text-gray-900">{formatPrice(product.price)}</p>
					</div>

					<!-- Stock status -->
					<div class="mt-4">
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {stock.available
								? 'bg-emerald-50 text-emerald-700'
								: 'bg-red-50 text-red-700'}"
						>
							{stock.label}
						</span>
					</div>
				</div>

				<!-- Image gallery -->
				<div class="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
					<h2 class="sr-only">Images</h2>
					<div class="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
						{#if mainImageUrl}
							<img
								src={mainImageUrl}
								alt={product.title}
								class="rounded-lg lg:col-span-2 lg:row-span-2"
							/>
						{:else}
							<div class="aspect-4/3 rounded-lg bg-gray-100 lg:col-span-2 lg:row-span-2"></div>
						{/if}
						{#each galleryImages as imgUrl (imgUrl)}
							<img src={imgUrl} alt={product.title} class="hidden rounded-lg lg:block" />
						{/each}
					</div>
				</div>

				<div class="mt-8 lg:col-span-5">
					<!-- Add to cart -->
					<div>
						<button
							type="button"
							onclick={addToCart}
							disabled={!stock.available}
							class="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						>
							{stock.available ? 'Add to cart' : 'Out of stock'}
						</button>
					</div>

					<!-- Product details -->
					{#if product.description && product.description.length > 0}
						<div class="mt-10">
							<h2 class="text-sm font-medium text-gray-900">Description</h2>
							<div class="mt-4">
								<PortableText value={product.description} />
							</div>
						</div>
					{/if}

					<!-- Attributes -->
					{#if product.attributes && product.attributes.length > 0}
						<div class="mt-8 border-t border-gray-200 pt-8">
							<h2 class="text-sm font-medium text-gray-900">Details</h2>
							<div class="mt-4">
								<ul
									role="list"
									class="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300"
								>
									{#each product.attributes as attr (attr.key)}
										<li class="pl-2"><span class="font-medium">{attr.key}:</span> {attr.value}</li>
									{/each}
								</ul>
							</div>
						</div>
					{/if}

					<!-- Policies -->
					<section aria-labelledby="policies-heading" class="mt-10">
						<h2 id="policies-heading" class="sr-only">Our Policies</h2>
						<dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
							<div class="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
								<dt>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										aria-hidden="true"
										class="mx-auto size-6 shrink-0 text-gray-400"
									>
										<path
											d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<span class="mt-4 text-sm font-medium text-gray-900">Handmade with care</span>
								</dt>
								<dd class="mt-1 text-sm text-gray-500">Every piece is uniquely crafted</dd>
							</div>
							<div class="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
								<dt>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										aria-hidden="true"
										class="mx-auto size-6 shrink-0 text-gray-400"
									>
										<path
											d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 1-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<span class="mt-4 text-sm font-medium text-gray-900">Worldwide shipping</span>
								</dt>
								<dd class="mt-1 text-sm text-gray-500">Free shipping on orders over €50</dd>
							</div>
						</dl>
					</section>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Charm scroll (bags only) -->
{#if isBag}
	<CharmScroll charms={data.charms} />
{/if}
