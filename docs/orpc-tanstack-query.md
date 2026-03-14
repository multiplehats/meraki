# oRPC + TanStack Query Svelte

## Overview

The dashboard uses **oRPC** for the API layer and **TanStack Query Svelte v6** for client-side data fetching, caching, and mutations. Widget visualizer flows remain on SvelteKit remote functions (`generation.remote.ts`).

**Why this stack:**

- Type-safe end-to-end RPC with Zod validation
- Automatic caching, background refetching, and stale-while-revalidate
- Optimistic updates with rollback
- Query invalidation for cross-component reactivity

## Architecture

```
Client (Svelte)                          Server (SvelteKit)
┌─────────────────┐                      ┌─────────────────────────┐
│ createQuery()   │──── fetch ──────────▶│ /api/rpc/[...rest]      │
│ createMutation()│◀─── response ───────│   └─ RPCHandler(router) │
│                 │                      │       └─ middleware      │
│ api.stores.list │                      │       └─ handler         │
│   .queryOptions │                      │       └─ repository      │
└─────────────────┘                      └─────────────────────────┘
        │
   @orpc/svelte-query
   bridges oRPC ↔ TanStack Query
```

## Key Files

| File                                      | Purpose                                        |
| ----------------------------------------- | ---------------------------------------------- |
| `src/lib/server/rpc/index.ts`             | Base procedure, auth/admin middleware          |
| `src/lib/server/rpc/router.ts`            | Root router (assembles all feature routers)    |
| `src/lib/config/rpc-client.ts`            | Client-side oRPC client + TanStack Query utils |
| `src/routes/api/rpc/[...rest]/+server.ts` | SvelteKit handler for oRPC requests            |
| `src/routes/+layout.ts`                   | QueryClient creation                           |
| `src/routes/+layout.svelte`               | QueryClientProvider wrapper                    |
| `src/lib/features/*/server/router.ts`     | Feature-specific oRPC routers                  |

## Server Side

### Base Procedure & Middleware

Located in `src/lib/server/rpc/index.ts`:

```typescript
import { os, ORPCError } from '@orpc/server';

export type ORPCContext = {
	locals: App.Locals;
};

const _base = os.$context<ORPCContext>().errors({
	UNAUTHORIZED: { message: 'Unauthorized' },
	FORBIDDEN: { message: 'Forbidden' },
	NOT_FOUND: { message: 'Not found' }
});

// Auth middleware — requires authenticated user + active org
const authMiddleware = _base.middleware(async ({ context, next }) => {
	const { user, activeOrganization, activeOrganizationMember } = context.locals;
	if (!user || !activeOrganization) {
		throw new ORPCError('UNAUTHORIZED');
	}
	return next({
		context: { user, activeOrganization, activeOrganizationMember }
	});
});

// Admin middleware — requires system admin role
const adminMiddleware = _base.middleware(async ({ context, next }) => {
	const { user, activeOrganization } = context.locals;
	if (!user || user.role !== 'admin') {
		throw new ORPCError('FORBIDDEN');
	}
	return next({
		context: { user, activeOrganization: activeOrganization ?? null }
	});
});

export const base = _base;
export const middleware = { auth: authMiddleware, admin: adminMiddleware };
```

### Feature Router

Each feature owns its router at `src/lib/features/<name>/server/router.ts`:

```typescript
// src/lib/features/stores/server/router.ts
import { z } from 'zod';
import { ORPCError } from '@orpc/server';
import { base, middleware } from '$lib/server/rpc';
import { listStoresWithWidgets, getStoreByIdForOrg, createStore } from './repository';

export const storesRouter = {
	list: base.use(middleware.auth).handler(async ({ context }) => {
		const org = context.activeOrganization;
		return {
			orgId: org.id,
			stores: await listStoresWithWidgets(org.id)
		};
	}),

	get: base
		.use(middleware.auth)
		.input(z.object({ storeId: z.string() }))
		.handler(async ({ input, context }) => {
			const store = await getStoreByIdForOrg(input.storeId, context.activeOrganization.id);
			if (!store) throw new ORPCError('NOT_FOUND');
			return store;
		}),

	create: base
		.use(middleware.auth)
		.input(createStoreSchema)
		.handler(async ({ input, context }) => {
			// ... create store logic
		})
};
```

### Root Router

Located in `src/lib/server/rpc/router.ts` — assembles all feature routers:

```typescript
import { storesRouter } from '$lib/features/stores/server/router';
import { widgetsRouter } from '$lib/features/widgets/server/router';
// ... other feature routers

export const router = {
	stores: storesRouter,
	widgets: widgetsRouter,
	analytics: analyticsRouter,
	billing: billingRouter,
	integrations: integrationsRouter,
	imageGeneration: imageGenerationRouter,
	uploads: uploadsRouter,
	organizations: organizationsRouter,
	modelPlayground: modelPlaygroundRouter
};

export type AppRouter = typeof router;
```

### SvelteKit Handler

Located in `src/routes/api/rpc/[...rest]/+server.ts`:

```typescript
import { RPCHandler } from '@orpc/server/fetch';
import { router } from '$lib/server/rpc/router';
import type { ORPCContext } from '$lib/server/rpc';
import type { RequestHandler } from './$types';

const handler = new RPCHandler<ORPCContext>(router);

const handle: RequestHandler = async ({ request, locals }) => {
	const { response } = await handler.handle(request, {
		prefix: '/api/rpc',
		context: { locals }
	});
	return response ?? new Response('Not Found', { status: 404 });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
```

## Client Side

### oRPC Client & TanStack Query Utils

Located in `src/lib/config/rpc-client.ts`:

```typescript
import { browser } from '$app/environment';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createORPCSvelteQueryUtils } from '@orpc/svelte-query';
import type { RouterClient, InferRouterOutputs } from '@orpc/server';
import type { AppRouter } from '$lib/server/rpc/router';

const link = new RPCLink({
	url: browser ? `${window.location.origin}/api/rpc` : 'http://localhost:5173/api/rpc',
	fetch: (input, init) => fetch(input, { ...init, credentials: 'include' })
});

// Low-level client (for fire-and-forget calls outside TanStack Query)
export const orpc: RouterClient<AppRouter> = createORPCClient(link);

// TanStack Query utils (for queryOptions, mutationOptions, key)
export const api = createORPCSvelteQueryUtils(orpc);

// Type helper for procedure return types
export type RouterOutputs = InferRouterOutputs<AppRouter>;
```

**Two exports:**

- `orpc` — raw oRPC client, use for one-off calls outside TanStack Query (e.g., `orpc.organizations.toggleMultiStore(...)`)
- `api` — TanStack Query bridge, use for `createQuery`/`createMutation` in components

### QueryClient Setup

Located in `src/routes/+layout.ts`:

```typescript
import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

export const load = async ({ data }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 60 * 5, // 5 min
				gcTime: 1000 * 60 * 10, // 10 min
				experimental_prefetchInRender: true // Required for Svelte 5 reactive contexts
			}
		}
	});
	return { ...data, queryClient };
};
```

The `QueryClientProvider` wraps the app in `src/routes/+layout.svelte`:

```svelte
<QueryClientProvider client={data.queryClient}>
	<!-- App content -->
</QueryClientProvider>
```

## Usage Patterns

### Queries

Use `createQuery` with `api.<feature>.<procedure>.queryOptions()`:

```svelte
<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { api } from '$lib/config/rpc-client';

	const storeId = $derived(page.params.storeId!);

	const storeQuery = createQuery(() => api.stores.get.queryOptions({ input: { storeId } }));
</script>

{#if storeQuery.isPending}
	<p>Loading...</p>
{:else if storeQuery.error}
	<p>Error: {storeQuery.error.message}</p>
{:else}
	<h1>{storeQuery.data.name}</h1>
{/if}
```

**Key points:**

- Pass a **thunk** (arrow function) to `createQuery` — this enables reactive inputs
- Input goes in `{ input: { ... } }`, NOT as direct properties
- Access data via `storeQuery.data` (no `$` prefix in Svelte 5)

### Mutations (Linear-Style)

All mutations follow a "Linear-style" UX pattern: fire-and-forget, no spinners, no success toasts, error-only feedback.

```svelte
<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { api } from '$lib/config/rpc-client';
	import { toast } from 'svelte-sonner';
	import { useFlash } from '$lib/hooks/use-flash.svelte';

	const queryClient = useQueryClient();
	const saved = useFlash();

	const updateMutation = createMutation(() =>
		api.stores.updateSettings.mutationOptions({
			onSuccess: () => saved.trigger(),
			onError: (error) => {
				toast.error(error.message || 'Failed to save');
			},
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey: api.stores.get.key({ input: { storeId } }) });
				queryClient.invalidateQueries({ queryKey: api.stores.list.key() });
			}
		})
	);

	function handleSubmit() {
		updateMutation.mutate({ storeId, name, domain }); // fire-and-forget
	}
</script>

<Button onclick={handleSubmit}>
	{#if saved.active}
		<CheckIcon class="size-4" /> Saved
	{:else}
		Save Changes
	{/if}
</Button>
```

**Rules:**

- Use `mutate()` (fire-and-forget), NOT `mutateAsync()` (unless you need the result, e.g., for navigation after creation)
- No spinners, no `disabled` states
- `onSuccess` — trigger flash indicator
- `onError` — show toast
- `onSettled` — invalidate related queries (runs on both success and error)

### Optimistic Updates

For delete/toggle operations where instant feedback matters:

```typescript
const deleteMutation = createMutation(() =>
	api.imageGeneration.delete.mutationOptions({
		onMutate: async () => {
			// 1. Cancel in-flight queries
			await queryClient.cancelQueries({ queryKey: api.imageGeneration.getByWidget.key() });

			// 2. Snapshot current data for rollback
			const queries = queryClient.getQueriesData({
				queryKey: api.imageGeneration.getByWidget.key()
			});

			// 3. Optimistically remove item from cache
			for (const [key, data] of queries) {
				if (!data) continue;
				const d = data as { generations: { items: { id: string }[] } };
				queryClient.setQueryData(key, {
					...d,
					generations: {
						...d.generations,
						items: d.generations.items.filter((g) => g.id !== generationId)
					}
				});
			}

			return { queries }; // snapshot for rollback
		},
		onError: (_err, _vars, context) => {
			// 4. Rollback on error
			if (context?.queries) {
				for (const [key, data] of context.queries) {
					queryClient.setQueryData(key, data);
				}
			}
			toast.error('Failed to delete');
		},
		onSettled: () => {
			// 5. Refetch to sync with server
			queryClient.invalidateQueries({ queryKey: api.imageGeneration.getByWidget.key() });
		}
	})
);
```

### Cache Key Methods

The `api.<feature>.<procedure>.key()` method generates query keys for cache operations:

```typescript
// Invalidate ALL stores queries (partial match)
queryClient.invalidateQueries({ queryKey: api.stores.key() });

// Invalidate a specific store query
queryClient.invalidateQueries({ queryKey: api.stores.get.key({ input: { storeId } }) });

// Invalidate the list query
queryClient.invalidateQueries({ queryKey: api.stores.list.key() });
```

**IMPORTANT:** The `.key()` method takes `{ type?, input?, fnOptions? }` — NOT direct properties:

```typescript
// CORRECT
api.stores.get.key({ input: { storeId } });

// WRONG — 'storeId' does not exist in type 'OperationKeyOptions'
api.stores.get.key({ storeId });
```

### useFlash Hook

Located in `src/lib/hooks/use-flash.svelte.ts` — brief reactive indicator for save buttons:

```typescript
import { useFlash } from '$lib/hooks/use-flash.svelte';

const saved = useFlash(1500); // auto-resets after 1500ms

// In mutation: onSuccess: () => saved.trigger()
// In template: {#if saved.active} Saved {:else} Save {/if}
```

## Organization Switch & Cache

Queries do NOT include `orgId` in their keys — the org context comes from server-side middleware (session cookie). When a user switches organizations, all cached data must be reset:

```typescript
// In src/routes/(session)/+layout.svelte
const queryClient = useQueryClient();

$effect(() => {
	const orgId = session.value?.data?.session?.activeOrganizationId;
	if (orgId !== prevOrgId) {
		prevOrgId = orgId;
		queryClient.resetQueries(); // Clear data + trigger refetches for active queries
		goto(resolve('/'));
	}
});
```

Use `resetQueries()` (not `clear()` or `invalidateQueries()`):

- `clear()` — removes data but may not trigger refetches
- `invalidateQueries()` — triggers refetches but old data still shows briefly
- `resetQueries()` — clears data AND triggers refetches (best for context switches)

## Adding a New Feature

### 1. Create the router

```typescript
// src/lib/features/<name>/server/router.ts
import { z } from 'zod';
import { ORPCError } from '@orpc/server';
import { base, middleware } from '$lib/server/rpc';

export const myFeatureRouter = {
	list: base.use(middleware.auth).handler(async ({ context }) => {
		// ...
	}),
	create: base
		.use(middleware.auth)
		.input(z.object({ name: z.string() }))
		.handler(async ({ input, context }) => {
			// ...
		})
};
```

### 2. Register in root router

```typescript
// src/lib/server/rpc/router.ts
import { myFeatureRouter } from '$lib/features/my-feature/server/router';

export const router = {
	// ... existing routers
	myFeature: myFeatureRouter
};
```

### 3. Use in components

```svelte
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { api } from '$lib/config/rpc-client';

	const listQuery = createQuery(() => api.myFeature.list.queryOptions({}));
	const queryClient = useQueryClient();

	const createMut = createMutation(() =>
		api.myFeature.create.mutationOptions({
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey: api.myFeature.list.key() });
			},
			onError: (error) => toast.error(error.message)
		})
	);
</script>
```

## Gotchas

1. **`experimental_prefetchInRender: true`** — Required on QueryClient for TanStack Query v6 when accessing query data in Svelte 5 reactive contexts (`$effect`, `$derived`). Without it, you get a runtime error.

2. **Query key input wrapper** — Always use `api.x.y.key({ input: { ... } })`, never `api.x.y.key({ prop })`.

3. **Thunk pattern** — Always pass an arrow function to `createQuery`/`createMutation` for reactive inputs:

   ```typescript
   // CORRECT — reactive
   createQuery(() => api.stores.get.queryOptions({ input: { storeId } }));
   // WRONG — storeId won't update
   createQuery(api.stores.get.queryOptions({ input: { storeId } }));
   ```

4. **`orpc` vs `api`** — Use `api` (TanStack Query utils) for queries/mutations in components. Use `orpc` (raw client) for one-off calls outside the query lifecycle (e.g., fire-and-forget `.then()/.catch()` patterns).

5. **Zod `.optional()` vs `.nullable()`** — oRPC input schemas use Zod. If a field is `.optional()`, pass `undefined` (not `null`).

6. **No `orgId` in query keys** — Org context comes from server middleware. On org switch, call `queryClient.resetQueries()` to clear stale data.
