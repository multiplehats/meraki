<script lang="ts">
	import type { PageData } from './$types';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Popover from '$lib/components/ui/popover';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import XIcon from '@lucide/svelte/icons/x';

	let { data }: { data: PageData } = $props();

	let mobileFiltersOpen = $state(false);

	const categories = ['Tees', 'Crewnecks', 'Hats', 'Bundles', 'Carry', 'Objects'];
	const brands = ['Clothing Company', 'Fashion Inc.', "Shoes 'n More", "Supplies 'n Stuff"];
	const colors = ['White', 'Black', 'Grey', 'Blue', 'Olive', 'Tan'];
	const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
	const sortOptions = [
		'Most Popular',
		'Best Rating',
		'Newest',
		'Price: Low to High',
		'Price: High to Low'
	];

	const filterSections = [
		{ label: 'Category', name: 'category', options: categories },
		{ label: 'Brand', name: 'brand', options: brands },
		{ label: 'Color', name: 'color', options: colors },
		{ label: 'Sizes', name: 'sizes', options: sizes }
	];

	const desktopFilters = [
		{ label: 'Category', name: 'category', options: categories, count: 1 },
		{ label: 'Brand', name: 'brand', options: brands },
		{ label: 'Color', name: 'color', options: colors },
		{ label: 'Sizes', name: 'sizes', options: sizes }
	];
</script>

<Drawer.Root bind:open={mobileFiltersOpen} direction="right">
	<main>
		<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
			<div class="py-24 text-center">
				<h1 class="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>
				<p class="mx-auto mt-4 max-w-3xl text-base text-gray-500">
					Thoughtfully designed objects for the workspace, home, and travel.
				</p>
			</div>

			<!-- Filters -->
			<section aria-labelledby="filter-heading" class="border-t border-gray-200 pt-6">
				<h2 id="filter-heading" class="sr-only">Product filters</h2>

				<div class="flex items-center justify-between">
					<!-- Sort dropdown -->
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
						>
							Sort
							<ChevronDownIcon
								class="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
							/>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start" class="w-44">
							{#each sortOptions as option}
								<DropdownMenu.Item>{option}</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>

					<!-- Mobile filter trigger -->
					<Drawer.Trigger
						class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
					>
						Filters
					</Drawer.Trigger>

					<!-- Desktop filter popovers -->
					<div class="hidden sm:flex sm:items-baseline sm:space-x-8">
						{#each desktopFilters as filter}
							<Popover.Root>
								<Popover.Trigger
									class="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
								>
									<span>{filter.label}</span>
									{#if filter.count}
										<span
											class="ml-1.5 rounded-sm bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700 tabular-nums"
											>{filter.count}</span
										>
									{/if}
									<ChevronDownIcon
										class="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
									/>
								</Popover.Trigger>
								<Popover.Content align="start" class="w-48">
									<form class="space-y-4">
										{#each filter.options as option}
											{@const id = `filter-${filter.name}-${option.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
											<div class="flex items-center gap-3">
												<Checkbox {id} name="{filter.name}[]" value={option.toLowerCase()} />
												<Label
													for={id}
													class="pr-6 text-sm font-medium whitespace-nowrap text-gray-900"
													>{option}</Label
												>
											</div>
										{/each}
									</form>
								</Popover.Content>
							</Popover.Root>
						{/each}
					</div>
				</div>
			</section>

			<!-- Product grid -->
			<section aria-labelledby="products-heading" class="mt-8">
				<h2 id="products-heading" class="sr-only">Products</h2>

				<div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-01.jpg"
							alt="Person using a pen to cross a task off a productivity paper card."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Focus Paper Refill</h3>
							<p>$13</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">3 sizes available</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-02.jpg"
							alt="Paper card sitting upright in walnut card holder on desk."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Focus Card Holder</h3>
							<p>$64</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Walnut</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-03.jpg"
							alt="Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Focus Carry Pouch</h3>
							<p>$32</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Heather Gray</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-04.jpg"
							alt="Stack of 3 small drab green cardboard paper card refill boxes with white text."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Focus Multi-Pack</h3>
							<p>$39</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">3 refill packs</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-05.jpg"
							alt="Hand holding black machined steel mechanical pencil with brass tip and top."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Machined Mechanical Pencil</h3>
							<p>$35</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Black and brass</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-06.jpg"
							alt="Brass scissors with geometric design, black steel finger holes, and included upright brass stand."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Brass Scissors</h3>
							<p>$50</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Includes brass stand</p>
					</a>
				</div>
			</section>

			<section
				aria-labelledby="featured-heading"
				class="relative mt-16 overflow-hidden rounded-lg lg:h-96"
			>
				<div class="absolute inset-0">
					<img
						src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-featured-collection.jpg"
						alt=""
						class="size-full object-cover"
					/>
				</div>
				<div aria-hidden="true" class="relative h-96 w-full lg:hidden"></div>
				<div aria-hidden="true" class="relative h-32 w-full lg:hidden"></div>
				<div
					class="absolute inset-x-0 bottom-0 rounded-br-lg rounded-bl-lg bg-black/75 p-6 backdrop-blur-sm backdrop-filter sm:flex sm:items-center sm:justify-between lg:inset-x-auto lg:inset-y-0 lg:w-96 lg:flex-col lg:items-start lg:rounded-tl-lg lg:rounded-br-none"
				>
					<div>
						<h2 id="featured-heading" class="text-xl font-bold text-white">Workspace Collection</h2>
						<p class="mt-1 text-sm text-gray-300">
							Upgrade your desk with objects that keep you organized and clear-minded.
						</p>
					</div>
					<a
						href="#"
						class="mt-6 flex shrink-0 items-center justify-center rounded-md border border-white/25 px-4 py-3 text-base font-medium text-white hover:bg-white/10 sm:mt-0 sm:ml-8 lg:ml-0 lg:w-full"
						>View the collection</a
					>
				</div>
			</section>

			<section aria-labelledby="more-products-heading" class="mt-16 pb-24">
				<h2 id="more-products-heading" class="sr-only">More products</h2>

				<div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-07.jpg"
							alt="Close up of long kettle spout pouring boiling water into pour-over coffee mug with frothy coffee."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Electric Kettle</h3>
							<p>$149</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Black</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-08.jpg"
							alt="Extra large black leather workspace pad on desk with computer, wooden shelf, desk organizer, and computer peripherals."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Leather Workspace Pad</h3>
							<p>$165</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Black</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-09.jpg"
							alt="Leather long wallet held open with hand-stitched card dividers, full-length bill pocket, and simple tab closure."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Leather Long Wallet</h3>
							<p>$118</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Natural</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-10.jpg"
							alt="Machined steel sphere puzzle with smooth finish, geometric seams, and included brass stand on wood desk."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Machined Sphere Puzzle</h3>
							<p>$95</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Includes brass stand</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-11.jpg"
							alt="Arm modeling wristwatch with black leather band, white watch face, thin watch hands, and fine time markings."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Minimalist Wristwatch</h3>
							<p>$149</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">3 wrist band options</p>
					</a>
					<a href="#" class="group">
						<img
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-12.jpg"
							alt="Circular leather coaster set with natural color and Enjoy the Journey embossed type."
							class="aspect-5/4 w-full rounded-lg object-cover group-hover:opacity-75"
						/>
						<div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
							<h3>Motto Leather Coaster Set</h3>
							<p>$18</p>
						</div>
						<p class="mt-1 text-sm text-gray-500 italic">Natural</p>
					</a>
				</div>
			</section>
		</div>
	</main>

	<Drawer.Content>
		<Drawer.Header class="flex flex-row items-center justify-between">
			<Drawer.Title>Filters</Drawer.Title>
			<Drawer.Close
				class="flex size-10 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50"
			>
				<XIcon class="size-5" />
				<span class="sr-only">Close</span>
			</Drawer.Close>
		</Drawer.Header>

		<div class="overflow-y-auto px-4 pb-6">
			<form>
				{#each filterSections as section}
					<Collapsible.Root class="border-t border-gray-200 py-6">
						<Collapsible.Trigger
							class="flex w-full items-center justify-between text-sm text-gray-400"
						>
							<span class="font-medium text-gray-900">{section.label}</span>
							<ChevronDownIcon
								class="size-5 transition-transform duration-200 data-[state=open]:rotate-180"
							/>
						</Collapsible.Trigger>
						<Collapsible.Content class="pt-6">
							<div class="space-y-6">
								{#each section.options as option}
									{@const id = `filter-mobile-${section.name}-${option.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
									<div class="flex items-center gap-3">
										<Checkbox {id} name="{section.name}[]" value={option.toLowerCase()} />
										<Label for={id} class="text-sm text-gray-500">{option}</Label>
									</div>
								{/each}
							</div>
						</Collapsible.Content>
					</Collapsible.Root>
				{/each}
			</form>
		</div>
	</Drawer.Content>
</Drawer.Root>
