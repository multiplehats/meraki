<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import * as Drawer from '$lib/components/ui/drawer';
	import { X, Minus, Plus, Trash2 } from '@lucide/svelte';
	import { cart } from '$lib/features/cart/store.svelte';
	import { formatPrice } from '$lib/features/products/types';

	type Props = StackItemProps<void>;

	let { item }: Props = $props();
	let checkingOut = $state(false);

	function handleOpenChange(open: boolean) {
		if (!open) {
			item.resolve();
		}
	}

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

<Drawer.Root direction="right" open={true} onOpenChange={handleOpenChange}>
	<Drawer.Content class="max-w-md">
		<div class="flex h-full flex-col overflow-y-auto">
			<div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
				<div class="flex items-start justify-between">
					<Drawer.Title class="text-lg font-medium text-gray-900">Shopping cart</Drawer.Title>
					<div class="ml-3 flex h-7 items-center">
						<Drawer.Close
							class="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
							aria-label="Close panel"
						>
							<span class="absolute -inset-0.5"></span>
							<X class="size-6" aria-hidden="true" />
						</Drawer.Close>
					</div>
				</div>

				<div class="mt-8">
					{#if cart.items.length === 0}
						<div class="py-12 text-center text-gray-500">
							<p class="text-sm">Your cart is empty.</p>
							<Drawer.Close class="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
								Continue shopping &rarr;
							</Drawer.Close>
						</div>
					{:else}
						<div class="flow-root">
							<ul role="list" class="-my-6 divide-y divide-gray-200">
								{#each cart.items as cartItem (cartItem.productId)}
									<li class="flex py-6">
										<div class="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
											{#if cartItem.imageUrl}
												<img
													src={cartItem.imageUrl}
													alt={cartItem.title}
													class="size-full object-cover"
												/>
											{:else}
												<div class="size-full bg-gray-100"></div>
											{/if}
										</div>
										<div class="ml-4 flex flex-1 flex-col">
											<div>
												<div class="flex justify-between text-base font-medium text-gray-900">
													<h3>
														<a href="/products/{cartItem.slug}">{cartItem.title}</a>
													</h3>
													<p class="ml-4">{formatPrice(cartItem.price * cartItem.qty)}</p>
												</div>
											</div>
											<div class="flex flex-1 items-end justify-between text-sm">
												<div class="flex items-center gap-2">
													<button
														type="button"
														onclick={() => cart.updateQty(cartItem.productId, cartItem.qty - 1)}
														class="rounded p-1 text-gray-400 hover:text-gray-600"
														aria-label="Decrease quantity"
													>
														<Minus class="size-3" />
													</button>
													<span class="text-gray-600">{cartItem.qty}</span>
													<button
														type="button"
														onclick={() => cart.updateQty(cartItem.productId, cartItem.qty + 1)}
														class="rounded p-1 text-gray-400 hover:text-gray-600"
														aria-label="Increase quantity"
													>
														<Plus class="size-3" />
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
						</div>
					{/if}
				</div>
			</div>

			{#if cart.items.length > 0}
				<Drawer.Footer class="border-t border-gray-200 px-4 py-6 sm:px-6">
					<div class="flex justify-between text-base font-medium text-gray-900">
						<p>Subtotal</p>
						<p>{formatPrice(cart.subtotal)}</p>
					</div>
					<p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
					<div class="mt-6">
						<button
							type="button"
							onclick={handleCheckout}
							disabled={checkingOut}
							class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{checkingOut ? 'Redirecting…' : 'Checkout'}
						</button>
					</div>
					<div class="mt-6 flex justify-center text-center text-sm text-gray-500">
						<p>
							or
							<Drawer.Close class="font-medium text-indigo-600 hover:text-indigo-500">
								Continue Shopping <span aria-hidden="true">&rarr;</span>
							</Drawer.Close>
						</p>
					</div>
				</Drawer.Footer>
			{/if}
		</div>
	</Drawer.Content>
</Drawer.Root>
