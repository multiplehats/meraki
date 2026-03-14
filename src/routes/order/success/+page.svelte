<script lang="ts">
	import type { PageData } from './$types';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let { data }: { data: PageData } = $props();
</script>

<div class="bg-white">
	<div class="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
		<div class="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50">
			<svg
				class="size-8 text-emerald-600"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
			</svg>
		</div>

		<h1 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">Order confirmed!</h1>
		<p class="mt-4 text-base text-gray-500">
			Thank you for your order. We'll start working on it right away — handmade with care, just for
			you.
		</p>
		<p class="mt-2 text-sm text-gray-400">
			A confirmation will be on its way once we have your email.
		</p>

		<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
			<a
				href="/products"
				class="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
			>
				Continue Shopping
			</a>
			<a href="/" class="text-base font-medium text-indigo-600 hover:text-indigo-500">
				Back to home &rarr;
			</a>
		</div>
	</div>
</div>
