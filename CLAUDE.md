# Project Overview

We are building **Merak'i** — a boutique crochet brand's ecommerce storefront. The store sells handmade crochet products directly to customers.

---

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Pre-Commit Checks

Always run before committing:

```bash
pnpm run check   # TypeScript + Svelte type checking
pnpm run lint    # ESLint
```

Fix all errors before committing. Do not use `--no-verify` to bypass these.

# Backend Architecture Patterns

## Overview

This document outlines the backend architecture using SvelteKit, Sanity, and the Sanity client. We follow a pragmatic approach that balances clean architecture principles with simplicity, avoiding unnecessary complexity while maintaining maintainability and scalability.

## Architecture Principles

1. **Start Simple, Evolve When Needed**: Begin with straightforward implementations and add abstractions only when complexity demands it
2. **Feature-First Organization**: Group related code by feature rather than technical layers
3. **Type Safety Throughout**: Leverage TypeScript and Sanity's generated types for end-to-end type safety
4. **Testability Without Overhead**: Structure code to be testable without complex dependency injection
5. **Performance by Default**: Optimize for read-heavy operations using Sanity's CDN

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Sanity Setup](#sanity-setup)
3. [Layer Definitions](#layer-definitions)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Error Handling](#error-handling)
6. [Pagination Strategy](#pagination-strategy)
7. [Development Workflow](#development-workflow)

For detailed information on:

- **Modal Stack System**: See [Modal Stack System](#modal-stack-system) below
- **Type System Template**: See [Type System Template](#type-system-template) below
- **ShadCN Svelte**: Use context7 MCP to check the shadcn-svelte documentation

---

## Project Structure

This architecture uses a **feature-first** approach, where each feature contains all related code (server logic, components, GROQ queries, types) in a single directory.

```
src/
├── lib/
│   ├── features/                    # Feature-based organization
│   │   ├── products/
│   │   │   ├── server/              # Server-only code (SvelteKit protected)
│   │   │   │   ├── repository.ts    # Data access layer (GROQ queries)
│   │   │   ├── components/          # Feature-specific UI components
│   │   │   ├── validators.ts        # Shared (client + server)
│   │   │   └── types.ts             # Shared (client + server)
│   │   │
│   │   ├── orders/
│   │   │   ├── server/
│   │   │   │   ├── repository.ts    # GROQ queries
│   │   │   │   └── service.ts       # Business logic (optional)
│   │   │   └── ...
│   │   │
│   │   └── [other-features]/
│   │
│   ├── client/
│   │   └── sanity.ts                # Sanity client configuration
│   │
│   ├── server/                      # Global server-only utilities
│   │   ├── sanity/
│   │   │   ├── client.ts            # Sanity server client (with token)
│   │   │   └── queries/             # Shared/global GROQ fragments
│   │   │
│   │   └── logger/                  # Centralized logging
│   │
│   └── components/                  # Global shared UI components
│       └── ui/                      # ShadCN components
│
├── routes/
│   └── studio/                      # Embedded Sanity Studio
│       └── [[...index]]/
│           └── +page.svelte         # Renders <SanityStudio />
│
└── sanity/
    ├── sanity.config.ts             # Sanity Studio configuration
    ├── schemas/                     # Document + object type schemas
    │   ├── index.ts                 # Schema registry
    │   ├── product.ts
    │   └── order.ts
    └── lib/
        └── image.ts                 # Image URL builder helpers
```

### Key Organizational Principles

**Feature Directory Structure:**

```
lib/features/<feature-name>/
├── server/           # Server-only code (protected by SvelteKit)
│   ├── repository.ts # GROQ queries — data access layer
│   └── service.ts    # Business logic (optional)
├── components/       # Feature-specific UI components
├── validators.ts     # SHARED - Use on client AND server
├── types.ts          # SHARED - Use on client AND server
└── index.ts          # Optional - Clean public API exports
```

**Why This Works:**

1. **SvelteKit Native Protection**: Any `server/` folder is automatically protected from client imports
2. **True Feature Cohesion**: Everything related to a feature lives in one place
3. **Clear Boundaries**: `server/` = server-only, `components/` = client-only, root level = shared
4. **Easy Refactoring**: Want to delete/extract a feature? Just move/delete its folder

### Import Path Conventions

**Always use absolute paths with the `$lib` alias:**

```typescript
// ✅ CORRECT
import { productRepository } from '$lib/features/products/server/repository';
import { insertProductSchema } from '$lib/features/products/validators';
import { sanityClient } from '$lib/server/sanity/client';

// ❌ AVOID: Relative paths
import { productRepository } from './repository';
```

---

## Sanity Setup

### Client Configuration

Two clients are needed: a **public read-only client** for the frontend and a **server client with token** for mutations.

```typescript
// src/lib/config/sanity.ts  — public client (CDN, no token)
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
	projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: import.meta.env.PUBLIC_SANITY_DATASET,
	apiVersion: '2024-01-01',
	useCdn: true // Fast reads via CDN
});
```

```typescript
// src/lib/server/sanity/client.ts  — server client (mutations, drafts)
import { createClient } from '@sanity/client';
import { SANITY_API_TOKEN } from '$env/static/private';

export const sanityServerClient = createClient({
	projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: import.meta.env.PUBLIC_SANITY_DATASET,
	apiVersion: '2024-01-01',
	useCdn: false, // Always fresh data server-side
	token: SANITY_API_TOKEN
});
```

### Image URL Builder

```typescript
// src/lib/sanity/lib/image.ts
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from '$lib/config/sanity';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}
```

Usage:

```typescript
urlFor(product.image).width(800).height(600).url();
```

### Embedded Studio Route

```svelte
<!-- src/routes/studio/[[...index]]/+page.svelte -->
<script lang="ts">
	import { SanityStudio } from 'sanity';
	import config from '../../../sanity/sanity.config';
</script>

<div style="height: 100vh;">
	<SanityStudio {config} />
</div>
```

```typescript
// sanity/sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './schemas';

export default defineConfig({
	projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: import.meta.env.PUBLIC_SANITY_DATASET,
	plugins: [structureTool(), visionTool()],
	schema: { types: schemas }
});
```

---

## Layer Definitions

### 1. Schema Layer

Sanity schema definitions that serve as the single source of truth for content structure.

Located in: `sanity/schemas/`

```typescript
// sanity/schemas/product.ts
import { defineField, defineType } from 'sanity';

export const product = defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (r) => r.required()
		}),
		defineField({ name: 'price', type: 'number', validation: (r) => r.required().positive() }),
		defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
		defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
		defineField({ name: 'inStock', type: 'boolean', initialValue: true })
	]
});
```

```typescript
// sanity/schemas/index.ts
import { product } from './product';
import { order } from './order';

export const schemas = [product, order];
```

> **No migrations needed.** Schema changes are deployed via `sanity deploy` or by running the studio. Sanity manages the dataset in the cloud.

### 2. Repository Layer (Required)

Lightweight data access layer that encapsulates GROQ queries. Every feature should have a repository.

Located in: `lib/features/*/server/repository.ts`

```typescript
// lib/features/products/server/repository.ts
import { sanityServerClient } from '$lib/server/sanity/client';
import { sanityClient } from '$lib/config/sanity';
import { groq } from '@sanity/client';
import type { Product, ProductListItem } from '../types';

const productFields = groq`
  _id,
  title,
  slug,
  price,
  inStock,
  image
`;

export async function getProduct(slug: string): Promise<Product | null> {
	return (
		(await sanityClient.fetch(
			groq`*[_type == "product" && slug.current == $slug][0] { ${productFields}, description }`,
			{ slug }
		)) ?? null
	);
}

export async function listProducts(): Promise<ProductListItem[]> {
	return await sanityClient.fetch(
		groq`*[_type == "product"] | order(_createdAt desc) { ${productFields} }`
	);
}

export async function createProduct(data: ProductInput): Promise<Product> {
	const created = await sanityServerClient.create({ _type: 'product', ...data });
	if (!created) throw new Error('Failed to create product');
	return created as Product;
}

export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<Product> {
	const updated = await sanityServerClient.patch(id).set(data).commit();
	return updated as Product;
}
```

**Guidelines:**

- Public reads → use `sanityClient` (CDN, no token)
- Mutations / admin reads → use `sanityServerClient` (token required)
- Use `groq` template tag for query strings — enables syntax highlighting and type generation
- Use `?? null` for consistent null returns on single-document fetches
- Keep logging minimal (errors and mutations only)

### 3. Service Layer (Optional)

Business logic and orchestration when needed. Add only when repository logic becomes too complex.

Located in: `lib/features/*/server/service.ts`

```typescript
// lib/features/orders/server/service.ts
export async function createOrderFromStripe(
	sessionId: string,
	lineItems: StripeLineItem[]
): Promise<Order> {
	// Resolve product references, build order document, write to Sanity
	const productIds = lineItems.map((item) => item.price?.product as string);
	const products = await resolveStripeProducts(productIds);
	return await createOrder({ sessionId, products, status: 'paid' });
}
```

**When to use:**

- Multiple repository operations need coordination
- Complex business rules that don't belong in the repository
- Stripe webhook handling, external service calls, etc.

### 4. Mutations Layer (Rare)

Side-effect orchestration for complex workflows. Only add when you have fire-and-forget operations.

Located in: `lib/features/*/server/mutations.ts`

```typescript
// lib/features/orders/server/mutations.ts
export async function createOrderAndNotify(order: OrderInput): Promise<Order> {
	const createdOrder = await createOrder(order);

	// Fire-and-forget side effects
	Promise.all([
		sendOrderConfirmationEmail(createdOrder),
		invalidateProductCache(order.productId)
	]).catch((error) => logger.error('Side effects failed', error));

	return createdOrder;
}
```

---

## Data Flow Architecture

### Storefront: SvelteKit Page Loads

Public storefront pages fetch directly from Sanity via the CDN client in `+page.server.ts`.

```typescript
// routes/(storefront)/products/[slug]/+page.server.ts
import { getProduct } from '$lib/features/products/server/repository';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const product = await getProduct(params.slug);
	if (!product) error(404, 'Product not found');
	return { product };
};
```

---

## Error Handling

Centralized error handling with custom error classes.

```typescript
// lib/server/utils/errors.ts
export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code?: string
	) {
		super(message);
		this.name = 'AppError';
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string) {
		super(`${resource} not found`, 404, 'NOT_FOUND');
	}
}

export class SanityMutationError extends AppError {
	constructor(message: string) {
		super(`Sanity write failed: ${message}`, 500, 'SANITY_MUTATION_ERROR');
	}
}
```

---

## Pagination Strategy

Sanity supports `[start...end]` slice notation in GROQ for offset pagination. Use this consistently across all list queries.

```typescript
// lib/server/sanity/utils.ts
export interface PaginationParams {
	page?: number;
	limit?: number;
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
}

export function getPaginationSlice(page = 1, limit = 20) {
	const start = (page - 1) * limit;
	const end = start + limit;
	return { start, end };
}
```

### Usage in Repositories

```typescript
export async function listProducts(
	pagination?: PaginationParams
): Promise<PaginatedResult<ProductListItem>> {
	const page = pagination?.page ?? 1;
	const limit = pagination?.limit ?? 20;
	const { start, end } = getPaginationSlice(page, limit);

	const [items, total] = await Promise.all([
		sanityClient.fetch(
			groq`*[_type == "product"] | order(_createdAt desc) [$start...$end] { ${productFields} }`,
			{ start, end }
		),
		sanityClient.fetch(groq`count(*[_type == "product"])`)
	]);

	return {
		items,
		total,
		page,
		limit,
		hasMore: end < total
	};
}
```

---

## Development Workflow

1. **Local Development:**

   ```bash
   pnpm run dev              # Start SvelteKit dev server (includes /studio route)
   npx sanity@latest manage  # Open Sanity project dashboard in browser
   ```

2. **Adding New Features:**
   - Create feature folder under `lib/features/` (use kebab-case)
   - Add schema to `sanity/schemas/` and register in `sanity/schemas/index.ts`
   - Run type generation: `pnpm run sanity:typegen`
   - Implement repository with GROQ queries (required)
   - Add service layer only if needed (optional)
   - Create validators and types

3. **Schema Changes:**

   ```bash
   pnpm run sanity:typegen    # Regenerate TypeScript types from Sanity schemas
   # No migrations needed — Sanity manages the dataset in the cloud
   ```

4. **Deploy Studio:**

   ```bash
   npx sanity@latest deploy   # Deploy Studio to sanity.io/manage
   # Or rely on the embedded /studio route in production (already handled by SvelteKit)
   ```

5. **Environment Variables:**
   ```bash
   PUBLIC_SANITY_PROJECT_ID=your_project_id
   PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token_with_write_access   # Server only, never expose to client
   ```

---

## Summary

This architecture provides:

- **Simplicity**: No database to provision, no migrations to run
- **Scalability**: Sanity scales reads globally via CDN
- **Maintainability**: Clear separation of concerns
- **Type Safety**: End-to-end type safety via `sanity-typegen`
- **Content Management**: Your girlfriend manages products in `/studio` without touching code

### Recommended Approach

1. **Direct Sanity fetch for Storefront**: Page loads fetch from CDN client — no extra API layer needed
2. **Feature-First Organization**: Co-locate all feature code
3. **Kebab-Case File Names**: Use kebab-case for files/folders
4. **Always Use `groq` Template Tag**: Enables syntax highlighting and type generation
5. **Two Clients**: `sanityClient` (CDN, public reads) and `sanityServerClient` mutations, token-protected)
6. **Linear-Style Mutations**: Fire-and-forget, no spinners, error-only toasts
7. **Minimal Logging**: Log errors and mutations, not simple getters
8. **Consistent Null Handling**: Use `?? null` for all nullable single-document fetches
9. **Self-Documenting Code**: Avoid file header comments, let code speak for itself
10. **shadcn-svelte for UI**: Use shadcn-svelte for all base UI components (`$lib/components/ui/`). Use the context7 MCP to look up shadcn-svelte docs when needed.
11. **Subtle motion only**: Use the `motion` and `motionInView` Svelte actions from `$lib/utils/motion.ts` for animations. Apply sparingly — only where it adds meaningful polish (entrances, reveals). Never animate for the sake of it. Prefer `motionInView` for content that scrolls into view, and use the preset `animations` object for consistency. You're free to introduce new presets. You can use context7 for `motion` documentation.

---

## Type System Template

This template demonstrates the **scalable, DRY** approach to creating types for new features using Sanity's generated types.

## Key Principles

1. **Single Source of Truth**: Types derive from Sanity schemas via `sanity-typegen`
2. **No Manual Duplication**: Generated types from `sanity.types.ts`
3. **GROQ Projection Types**: Use `SanityDocument` or manually type projection results
4. **Clear Naming Convention**: Base → List → Detail
5. **Nullable at Repository, Non-null at Component**: Type narrowing at boundaries

## Quick Template

### 1. Define Sanity Schema

```typescript
// sanity/schemas/product.ts
export const product = defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string' }),
		defineField({ name: 'slug', type: 'slug' }),
		defineField({ name: 'price', type: 'number' }),
		defineField({ name: 'image', type: 'image', options: { hotspot: true } })
	]
});
```

### 2. Generate Types

```bash
pnpm run sanity:typegen
# Generates: src/sanity.types.ts
```

### 3. Create Feature Types

```typescript
// src/lib/features/products/types.ts
import type { SanityDocument } from '@sanity/types';

// Base type (from generated types or manual)
export type Product = SanityDocument & {
	title: string;
	slug: { current: string };
	price: number;
	image: SanityImageSource;
	description?: PortableTextBlock[];
	inStock: boolean;
};

// List view type (minimal projection)
export type ProductListItem = Pick<
	Product,
	'_id' | 'title' | 'slug' | 'price' | 'image' | 'inStock'
>;

// Non-null version for components
export type ProductDetail = NonNullable<Product>;

// Input type for mutations
export type ProductInput = Omit<Product, '_id' | '_type' | '_createdAt' | '_updatedAt' | '_rev'>;
```

### 4. Repository with Explicit Return Types

```typescript
// src/lib/features/products/server/repository.ts
export async function listProducts(): Promise<ProductListItem[]> {
	return await sanityClient.fetch(groq`*[_type == "product"] { ... }`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
	return (await sanityClient.fetch(groq`*[...][0]`, { slug })) ?? null;
}
```

### 5. Page Load with Type Narrowing

```typescript
// src/routes/(storefront)/products/[slug]/+page.server.ts
export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductBySlug(params.slug);

	if (!product) error(404, 'Product not found');

	// Type narrowing: now guaranteed non-null
	const detail: ProductDetail = product;
	return { product: detail };
};
```

### 6. Component with Non-Null Props

```svelte
<script lang="ts">
	import type { PageData } from './$types';
	import type { ProductDetail } from '$lib/features/products/types';
	import { urlFor } from '$lib/sanity/lib/image';

	let { data }: { data: PageData } = $props();
	const product: ProductDetail = data.product;
</script>

<h1>{product.title}</h1>
<img src={urlFor(product.image).width(800).url()} alt={product.title} />
<p>€{product.price}</p>
```

## Checklist for New Feature

- [ ] Define schema in `sanity/schemas/<feature>.ts` and register in `sanity/schemas/index.ts`
- [ ] Run `pnpm run sanity:typegen` to regenerate types
- [ ] Create `types.ts` with Base, List, Detail, and Input types
- [ ] Create repository with GROQ queries and explicit return types
- [ ] Use type narrowing in page loads (after `error(404)`)
- [ ] Component props use non-null types
- [ ] Run `pnpm run check` to verify

---

## Modal Stack System

## Overview

The modal stack system is built on `@svelte-put/async-stack`, providing a centralized, type-safe way to manage modals. It uses a promise-based architecture that allows components to push modals onto a stack and await their resolution.

## Architecture

### Stack Configuration

Located in: `src/lib/components/modal-stack/config.ts`

```typescript
import { stack } from '@svelte-put/async-stack';

export const modalStack = stack()
	.addVariant('confirm', ConfirmationModal)
	.addVariant('addProduct', AddProductModal)
	.build();
```

### Provider Component

Located in: `src/lib/components/modal-stack/modal-stack-provider.svelte`

- Sets up the modal stack in Svelte context
- Renders active modals
- Provides the `useModals()` hook
- Automatically clears modals on navigation

## Usage

### Setup

Wrap your app in the root layout:

```svelte
<script>
	import { ModalStackProvider } from '$lib/components/modal-stack';
</script>

<ModalStackProvider>
	<!-- Your app content -->
</ModalStackProvider>
```

### Using Modals in Components

```svelte
<script lang="ts">
	import { useModals } from '$lib/components/modal-stack/modal-stack-provider.svelte';

	const modals = useModals();

	async function handleDelete() {
		const modal = modals.push('confirm', {
			props: {
				title: 'Delete Product',
				description: 'Are you sure?',
				type: 'delete'
			}
		});

		const result = await modal.resolution;
		if (result.confirmed) {
			// proceed with delete
		}
	}
</script>
```

## Creating Modal Components

```svelte
<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';

	let { item, title, description }: StackItemProps<{ confirmed: boolean }> & Props = $props();

	function handleConfirm() {
		item.resolve({ confirmed: true });
	}
	function handleCancel() {
		item.resolve({ confirmed: false });
	}
</script>

<dialog>
	<h2>{title}</h2>
	<p>{description}</p>
	<button onclick={handleConfirm}>Confirm</button>
	<button onclick={handleCancel}>Cancel</button>
</dialog>
```
