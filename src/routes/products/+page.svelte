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
	import ProductCard from '$lib/features/products/components/product-card.svelte';

	let { data }: { data: PageData } = $props();

	let mobileFiltersOpen = $state(false);

	const sortOptions = [
		'Most Popular',
		'Best Rating',
		'Newest',
		'Price: Low to High',
		'Price: High to Low'
	];

	const categoryOptions = $derived(
		data.categories.map((c) => ({ label: c.name, value: c.slug.current }))
	);

	const filterSections = $derived([
		{ label: 'Category', name: 'category', options: categoryOptions }
	]);

	const desktopFilters = $derived([
		{
			label: 'Category',
			name: 'category',
			options: categoryOptions,
			count: data.selectedCategory ? 1 : 0
		}
	]);
</script>

<Drawer.Root bind:open={mobileFiltersOpen} direction="right">
	<div class="py-24 text-center">
		<h1 class="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>
		<p class="mx-auto mt-4 max-w-3xl text-base text-gray-500">
			Handcrafted with love — browse our latest crochet creations.
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
					{#each sortOptions as option (option)}
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
				{#each desktopFilters as filter (filter.name)}
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
								{#each filter.options as option (option.value)}
									{@const id = `filter-${filter.name}-${option.value}`}
									<div class="flex items-center gap-3">
										<Checkbox
											{id}
											name="{filter.name}[]"
											value={option.value}
											checked={data.selectedCategory === option.value}
										/>
										<Label for={id} class="pr-6 text-sm font-medium whitespace-nowrap text-gray-900"
											>{option.label}</Label
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

		{#if data.products.length === 0}
			<div class="py-16 text-center text-gray-500">
				<p>No products found. Check back soon!</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
				{#each data.products as product (product._id)}
					<ProductCard {product} />
				{/each}
			</div>
		{/if}
	</section>

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
				{#each filterSections as section (section.name)}
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
								{#each section.options as option (option.value)}
									{@const id = `filter-mobile-${section.name}-${option.value}`}
									<div class="flex items-center gap-3">
										<Checkbox {id} name="{section.name}[]" value={option.value} />
										<Label for={id} class="text-sm text-gray-500">{option.label}</Label>
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
