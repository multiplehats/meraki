<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import * as Drawer from '$lib/components/ui/drawer';
	import { X } from '@lucide/svelte';

	type Props = StackItemProps<void>;

	let { item }: Props = $props();

	function handleOpenChange(open: boolean) {
		if (!open) {
			item.resolve();
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
					<div class="flow-root">
						<ul role="list" class="-my-6 divide-y divide-gray-200">
							<li class="flex py-6">
								<div class="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
									<img
										src="https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"
										alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
										class="size-full object-cover"
									/>
								</div>
								<div class="ml-4 flex flex-1 flex-col">
									<div>
										<div class="flex justify-between text-base font-medium text-gray-900">
											<h3><a href="#">Throwback Hip Bag</a></h3>
											<p class="ml-4">$90.00</p>
										</div>
										<p class="mt-1 text-sm text-gray-500">Salmon</p>
									</div>
									<div class="flex flex-1 items-end justify-between text-sm">
										<p class="text-gray-500">Qty 1</p>
										<div class="flex">
											<button
												type="button"
												class="font-medium text-indigo-600 hover:text-indigo-500"
											>
												Remove
											</button>
										</div>
									</div>
								</div>
							</li>
							<li class="flex py-6">
								<div class="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
									<img
										src="https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-02.jpg"
										alt="Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch."
										class="size-full object-cover"
									/>
								</div>
								<div class="ml-4 flex flex-1 flex-col">
									<div>
										<div class="flex justify-between text-base font-medium text-gray-900">
											<h3><a href="#">Medium Stuff Satchel</a></h3>
											<p class="ml-4">$32.00</p>
										</div>
										<p class="mt-1 text-sm text-gray-500">Blue</p>
									</div>
									<div class="flex flex-1 items-end justify-between text-sm">
										<p class="text-gray-500">Qty 1</p>
										<div class="flex">
											<button
												type="button"
												class="font-medium text-indigo-600 hover:text-indigo-500"
											>
												Remove
											</button>
										</div>
									</div>
								</div>
							</li>
							<li class="flex py-6">
								<div class="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
									<img
										src="https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-03.jpg"
										alt="Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls."
										class="size-full object-cover"
									/>
								</div>
								<div class="ml-4 flex flex-1 flex-col">
									<div>
										<div class="flex justify-between text-base font-medium text-gray-900">
											<h3><a href="#">Zip Tote Basket</a></h3>
											<p class="ml-4">$140.00</p>
										</div>
										<p class="mt-1 text-sm text-gray-500">White and black</p>
									</div>
									<div class="flex flex-1 items-end justify-between text-sm">
										<p class="text-gray-500">Qty 1</p>
										<div class="flex">
											<button
												type="button"
												class="font-medium text-indigo-600 hover:text-indigo-500"
											>
												Remove
											</button>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<Drawer.Footer class="border-t border-gray-200 px-4 py-6 sm:px-6">
				<div class="flex justify-between text-base font-medium text-gray-900">
					<p>Subtotal</p>
					<p>$262.00</p>
				</div>
				<p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
				<div class="mt-6">
					<a
						href="#"
						class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
					>
						Checkout
					</a>
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
		</div>
	</Drawer.Content>
</Drawer.Root>
