<script lang="ts">
	import { motionInView, motion, animations } from '$lib/utils/motion';
</script>

<!-- Design A: "Black Market" — high contrast, editorial, bold -->

<!-- Hero: full-bleed black with oversized type -->
<section class="relative -mx-4 min-h-screen overflow-hidden bg-stone-950 sm:-mx-6 lg:-mx-8">
	<!-- Background texture image, very dark -->
	<div class="absolute inset-0">
		<img
			src="https://picsum.photos/seed/dark-texture/1400/900"
			alt=""
			class="h-full w-full object-cover opacity-20 mix-blend-luminosity"
		/>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex min-h-screen flex-col justify-between py-12">
			<!-- Top row: season label + scrolling text -->
			<div class="flex items-center justify-between">
				<span
					use:motion={animations.fadeIn(0.2)}
					class="text-xs font-medium tracking-[0.4em] text-stone-500 uppercase"
				>
					SS 2025
				</span>
				<span
					use:motion={animations.fadeIn(0.3)}
					class="text-xs font-medium tracking-[0.4em] text-stone-500 uppercase"
				>
					Handmade · Netherlands
				</span>
			</div>

			<!-- Center: massive headline -->
			<div class="py-16">
				<h1
					use:motion={{
						keyframes: { opacity: [0, 1], y: [40, 0] },
						options: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
					}}
					class="text-[clamp(5rem,15vw,14rem)] leading-[0.85] font-black tracking-[-0.03em] text-white uppercase"
				>
					MERA<span class="text-orange-500">KI</span>
				</h1>
				<div class="mt-4 flex items-center gap-6">
					<div class="h-px flex-1 bg-stone-700"></div>
					<p class="text-sm font-light tracking-widest text-stone-400">Crochet. Handmade. Yours.</p>
				</div>
			</div>

			<!-- Bottom row: CTA + image teaser -->
			<div class="grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
				<div>
					<p
						use:motion={animations.fadeInUp(0.6)}
						class="max-w-xs text-base leading-relaxed text-stone-400"
					>
						Each piece is made slowly, by hand, with intention. No factories. No shortcuts. Just
						craft.
					</p>
					<a
						use:motion={animations.fadeInUp(0.7)}
						href="/products"
						class="group mt-8 inline-flex items-center gap-4"
					>
						<span
							class="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500 text-lg text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white"
						>
							→
						</span>
						<span class="text-sm font-medium tracking-widest text-white uppercase">
							Shop collection
						</span>
					</a>
				</div>

				<!-- Floating image card -->
				<div
					use:motion={{
						keyframes: { opacity: [0, 1], x: [30, 0] },
						options: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }
					}}
					class="relative ml-auto w-64 lg:w-80"
				>
					<img
						src="https://picsum.photos/seed/meraki-hero/400/500"
						alt="Handmade crochet"
						class="w-full object-cover"
					/>
					<div class="absolute -bottom-4 -left-4 bg-orange-500 px-4 py-3">
						<p class="text-xs font-bold tracking-widest text-white uppercase">New in</p>
						<p class="text-lg font-black text-white">€68</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Horizontal type marquee -->
<div class="-mx-4 overflow-hidden border-y-2 border-stone-900 bg-orange-500 py-4 sm:-mx-6 lg:-mx-8">
	<div class="flex animate-[marquee_18s_linear_infinite] gap-0 whitespace-nowrap">
		{#each Array(4) as _, i (i)}
			<span
				class="flex shrink-0 items-center text-2xl font-black tracking-tight text-white uppercase"
			>
				<span class="px-8">HANDMADE</span>
				<span class="text-white/40">◆</span>
				<span class="px-8">SLOW FASHION</span>
				<span class="text-white/40">◆</span>
				<span class="px-8">MADE IN NL</span>
				<span class="text-white/40">◆</span>
				<span class="px-8">NATURAL YARNS</span>
				<span class="text-white/40">◆</span>
			</span>
		{/each}
	</div>
</div>

<!-- Categories: black editorial grid -->
<section class="-mx-4 bg-stone-950 px-4 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div
			use:motionInView={animations.fadeInUp()}
			class="mb-12 flex items-center justify-between border-b border-stone-800 pb-6"
		>
			<h2 class="text-xs font-medium tracking-[0.4em] text-stone-500 uppercase">Collections</h2>
			<a
				href="/products"
				class="text-xs font-medium tracking-widest text-orange-500 uppercase hover:text-orange-400"
			>
				All →
			</a>
		</div>

		<div class="grid grid-cols-12 gap-px bg-stone-800">
			<!-- Large -->
			<a
				href="/products"
				class="group relative col-span-12 overflow-hidden bg-stone-950 lg:col-span-7"
			>
				<div class="aspect-video overflow-hidden lg:aspect-auto lg:h-[500px]">
					<img
						src="https://picsum.photos/seed/cat-bags/800/500"
						alt="Bags"
						class="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
					/>
				</div>
				<div
					class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"
				></div>
				<div class="absolute bottom-0 p-8">
					<p class="text-xs tracking-[0.3em] text-stone-500 uppercase">01 —</p>
					<h3 class="mt-1 text-4xl font-black text-white uppercase">Bags &<br />Totes</h3>
					<p class="mt-2 text-sm text-stone-400">12 handmade pieces</p>
					<span
						class="mt-4 inline-block text-xs font-medium tracking-widest text-orange-500 uppercase group-hover:text-orange-400"
					>
						Explore →
					</span>
				</div>
			</a>

			<div class="col-span-12 grid grid-rows-2 gap-px lg:col-span-5">
				{#each [{ n: '02', name: 'Home & Living', count: '8 pieces', seed: 'cat-home' }, { n: '03', name: 'Accessories', count: '15 pieces', seed: 'cat-acc' }] as c (c.n)}
					<a href="/products" class="group relative overflow-hidden bg-stone-950">
						<div class="h-full min-h-[250px] overflow-hidden">
							<img
								src="https://picsum.photos/seed/{c.seed}/500/280"
								alt={c.name}
								class="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
							/>
						</div>
						<div
							class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"
						></div>
						<div class="absolute bottom-0 p-6">
							<p class="text-xs tracking-[0.3em] text-stone-500 uppercase">{c.n} —</p>
							<h3 class="mt-1 text-2xl font-black text-white uppercase">{c.name}</h3>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Statement section: white on black -->
<section class="-mx-4 bg-white px-4 py-24 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
			<div>
				<p
					use:motionInView={animations.fadeInUp()}
					class="text-xs font-medium tracking-[0.4em] text-stone-400 uppercase"
				>
					The Meraki standard
				</p>
				<h2
					use:motionInView={animations.fadeInUp(0.1)}
					class="mt-6 text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] font-black tracking-tight text-stone-950 uppercase"
				>
					Made by<br />
					<span class="text-orange-500">real</span><br />
					hands.
				</h2>
			</div>
			<div class="flex flex-col justify-end">
				<p
					use:motionInView={animations.fadeInUp(0.2)}
					class="text-lg leading-relaxed text-stone-600"
				>
					We don't do mass production. Every bag, every accessory, every piece for your home is made
					one at a time — by hand, with natural yarns, by a real person who cares.
				</p>
				<div
					use:motionInView={animations.fadeInUp(0.3)}
					class="mt-12 grid grid-cols-3 gap-8 border-t-2 border-stone-950 pt-8"
				>
					{#each [['100%', 'Handmade'], ['40h+', 'Per piece'], ['0', 'Factories']] as [n, l] (n)}
						<div>
							<p class="text-4xl font-black text-stone-950">{n}</p>
							<p class="mt-1 text-xs font-medium tracking-widest text-stone-400 uppercase">{l}</p>
						</div>
					{/each}
				</div>
				<a
					use:motionInView={animations.fadeInUp(0.4)}
					href="/products"
					class="mt-10 inline-flex items-center justify-center bg-stone-950 px-10 py-4 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-orange-500"
				>
					Shop now
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Products: editorial grid -->
<section class="-mx-4 bg-stone-100 px-4 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div use:motionInView={animations.fadeInUp()} class="mb-12 flex items-end justify-between">
			<h2 class="text-5xl font-black tracking-tight text-stone-950 uppercase">New<br />arrivals</h2>
			<a
				href="/products"
				class="text-xs font-bold tracking-widest text-stone-500 uppercase hover:text-stone-950"
			>
				View all →
			</a>
		</div>

		<!-- Staggered grid -->
		<div class="grid grid-cols-12 gap-4">
			{#each [{ name: 'Raffia Market Bag', price: '€68', seed: 'prod1', span: 'col-span-12 sm:col-span-7', tag: 'Bestseller' }, { name: 'Cotton Tote', price: '€54', seed: 'prod2', span: 'col-span-12 sm:col-span-5', tag: '' }, { name: 'Boho Mini Purse', price: '€42', seed: 'prod3', span: 'col-span-12 sm:col-span-4', tag: 'New' }, { name: 'Linen Clutch', price: '€36', seed: 'prod4', span: 'col-span-12 sm:col-span-4', tag: '' }, { name: 'Bucket Bag', price: '€72', seed: 'prod5', span: 'col-span-12 sm:col-span-4', tag: 'Limited' }] as p, i (p.seed)}
				<a
					href="/products"
					use:motionInView={animations.fadeInScale(i * 0.07)}
					class="group {p.span}"
				>
					<div class="relative aspect-[4/5] overflow-hidden bg-stone-200">
						<img
							src="https://picsum.photos/seed/{p.seed}/400/500"
							alt={p.name}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						{#if p.tag}
							<div
								class="absolute top-0 right-0 bg-orange-500 px-3 py-1.5 text-xs font-bold tracking-widest text-white uppercase"
							>
								{p.tag}
							</div>
						{/if}
					</div>
					<div class="mt-3 flex items-center justify-between">
						<div>
							<p class="font-bold tracking-tight text-stone-950 uppercase">{p.name}</p>
							<p class="text-sm text-stone-500">Handmade crochet</p>
						</div>
						<p class="text-lg font-black text-stone-950">{p.price}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Newsletter: full black -->
<section class="-mx-4 bg-stone-950 px-4 py-24 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
			<h2
				use:motionInView={animations.fadeInUp()}
				class="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-black text-white uppercase"
			>
				First to<br />
				<span class="text-orange-500">know.</span><br />
				Last to<br />
				miss out.
			</h2>
			<div use:motionInView={animations.fadeInUp(0.15)}>
				<p class="text-stone-400">
					New drops sell fast. Get early access and 10% off your first order.
				</p>
				<form class="mt-8 flex flex-col gap-3">
					<input
						type="email"
						placeholder="YOUR EMAIL"
						class="border-b-2 border-stone-700 bg-transparent py-3 text-sm font-medium tracking-widest text-white uppercase placeholder:text-stone-700 focus:border-orange-500 focus:outline-none"
					/>
					<button
						type="submit"
						class="mt-2 self-start bg-orange-500 px-10 py-4 text-sm font-bold tracking-widest text-white uppercase hover:bg-orange-400"
					>
						Subscribe →
					</button>
				</form>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-25%);
		}
	}
</style>
