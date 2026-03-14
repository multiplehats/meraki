<script lang="ts">
	import { cart } from '$lib/features/cart/store.svelte';
	import { formatPrice } from '$lib/features/products/types';
	import { Minus, Plus, Trash2 } from '@lucide/svelte';

	let checkingOut = $state(false);

	async function handleCheckout() {
		checkingOut = true;
		try {
			const res = await fetch('/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: cart.items,
					successUrl: `${window.location.origin}/order/success`,
					cancelUrl: window.location.href
				})
			});
			const { url } = await res.json();
			window.location.href = url;
		} catch (err) {
			console.error('Checkout error:', err);
			checkingOut = false;
		}
	}
</script>

<div class="bg-white">
	<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
		<h1 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
			Shopping Cart
		</h1>

		{#if cart.items.length === 0}
			<div class="mt-16 text-center">
				<p class="text-gray-500">Your cart is empty.</p>
				<a
					href="/products"
					class="mt-6 inline-block font-medium text-indigo-600 hover:text-indigo-500"
				>
					Continue Shopping &rarr;
				</a>
			</div>
		{:else}
			<form class="mt-12">
				<section aria-labelledby="cart-heading">
					<h2 id="cart-heading" class="sr-only">Items in your shopping cart</h2>

					<ul role="list" class="divide-y divide-gray-200 border-t border-b border-gray-200">
						{#each cart.items as cartItem (cartItem.productId)}
							<li class="flex py-6">
								<div class="shrink-0">
									{#if cartItem.imageUrl}
										<img
											src={cartItem.imageUrl}
											alt={cartItem.title}
											class="size-24 rounded-md object-cover sm:size-32"
										/>
									{:else}
										<div class="size-24 rounded-md bg-gray-100 sm:size-32"></div>
									{/if}
								</div>

								<div class="ml-4 flex flex-1 flex-col sm:ml-6">
									<div>
										<div class="flex justify-between">
											<h4 class="text-sm">
												<a
													href="/products/{cartItem.slug}"
													class="font-medium text-gray-700 hover:text-gray-800"
												>
													{cartItem.title}
												</a>
											</h4>
											<p class="ml-4 text-sm font-medium text-gray-900">
												{formatPrice(cartItem.price * cartItem.qty)}
											</p>
										</div>
										<p class="mt-1 text-sm text-gray-500">{formatPrice(cartItem.price)} each</p>
									</div>

									<div class="mt-4 flex flex-1 items-end justify-between">
										<div class="flex items-center gap-2">
											<button
												type="button"
												onclick={() => cart.updateQty(cartItem.productId, cartItem.qty - 1)}
												class="rounded border border-gray-200 p-1.5 text-gray-400 hover:text-gray-600"
												aria-label="Decrease quantity"
											>
												<Minus class="size-3.5" />
											</button>
											<span class="w-8 text-center text-sm text-gray-700">{cartItem.qty}</span>
											<button
												type="button"
												onclick={() => cart.updateQty(cartItem.productId, cartItem.qty + 1)}
												class="rounded border border-gray-200 p-1.5 text-gray-400 hover:text-gray-600"
												aria-label="Increase quantity"
											>
												<Plus class="size-3.5" />
											</button>
										</div>
										<button
											type="button"
											onclick={() => cart.removeItem(cartItem.productId)}
											class="p-1 text-gray-400 hover:text-red-500"
											aria-label="Remove item"
										>
											<Trash2 class="size-4" />
										</button>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				</section>

				<!-- Order summary -->
				<section aria-labelledby="summary-heading" class="mt-10">
					<h2 id="summary-heading" class="sr-only">Order summary</h2>

					<div>
						<dl class="space-y-4">
							<div class="flex items-center justify-between">
								<dt class="text-base font-medium text-gray-900">Subtotal</dt>
								<dd class="ml-4 text-base font-medium text-gray-900">
									{formatPrice(cart.subtotal)}
								</dd>
							</div>
						</dl>
						<p class="mt-1 text-sm text-gray-500">
							Shipping and taxes will be calculated at checkout.
						</p>
					</div>

					<div class="mt-10">
						<button
							type="button"
							onclick={handleCheckout}
							disabled={checkingOut}
							class="block w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-center text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60"
						>
							{checkingOut ? 'Redirecting…' : 'Checkout'}
						</button>
					</div>

					<div class="mt-6 text-center text-sm">
						<p>
							or
							<a href="/products" class="font-medium text-indigo-600 hover:text-indigo-500">
								Continue Shopping <span aria-hidden="true"> &rarr;</span>
							</a>
						</p>
					</div>
				</section>
			</form>
		{/if}
	</div>
</div>
