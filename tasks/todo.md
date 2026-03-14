# Merak'i — Full Build Plan

## Status Legend

- `[ ]` Not started
- `[x]` Complete
- `[-]` In progress
- `[~]` Skipped / deferred

---

## Phase 1 — Foundation & Sanity Setup

### 1.1 Environment & Dependencies

- [ ] Create `.env.local` with `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` _(user must do after Sanity project init)_
- [x] Create `.env.example` with placeholder values (no secrets)
- [x] Install Sanity dependencies: `@sanity/client`, `@sanity/image-url`, `sanity`, `@sanity/vision`
- [x] Install `@portabletext/svelte`
- [ ] Install Stripe: `stripe`, `@stripe/stripe-js`
- [ ] Install Resend: `resend`
- [ ] Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY` to `.env.local` and `.env.example`
- [ ] Add `PUBLIC_SITE_URL` to env (used for download link generation)

### 1.2 Sanity Configuration

- [x] Create `src/lib/config/sanity.ts` — public CDN client (no token)
- [x] Create `src/lib/server/sanity/client.ts` — server client with `SANITY_API_TOKEN`
- [x] Create `src/lib/sanity/lib/image.ts` — `urlFor()` image URL builder helper

### 1.3 Sanity Schemas

- [x] Create `sanity/schemas/category.ts`
- [x] Create `sanity/schemas/product.ts`
- [x] Create `sanity/schemas/shipping-zone.ts`
- [x] Create `sanity/schemas/order.ts`
- [x] Create `sanity/schemas/download-token.ts`
- [x] Create `sanity/schemas/tax-config.ts`
- [x] Create `sanity/schemas/index.ts` — register all schemas
- [x] Create `sanity.config.ts` — configure structureTool, visionTool, schemas

### 1.4 Sanity Studio Route

- [x] Create `src/routes/studio/[...index]/+page.svelte` — renders studio via `renderStudio()`
- [ ] Verify studio loads at `/studio` _(needs Sanity project credentials)_

### 1.5 Custom Studio Desk Structure (Orders View)

- [ ] Create `sanity/plugins/desk-structure.ts` — custom structure grouping orders
- [ ] Order document view: status badge, customer details, line item snapshots, totals
- [ ] `stripePaymentUrl` field renders as clickable "View in Stripe" link
- [ ] Register custom desk in `sanity.config.ts`
- [ ] Add conditional field visibility rules (hide stock/backorder when `category.isDigital`)

### 1.6 Type Generation

- [x] Add `sanity:typegen` script to `package.json`: `sanity typegen generate`
- [x] Create `sanity.cli.ts` with project config pointing to schemas
- [ ] Run `pnpm run sanity:typegen` → generates `src/sanity.types.ts` _(needs Sanity project credentials)_

---

## Phase 2 — Product Feature

### 2.1 Product Types

- [x] Create `src/lib/features/products/types.ts` — `Product`, `ProductListItem`, `ProductDetail`, `ProductAttribute`, `CategoryListItem`, `formatPrice()`, `stockStatus()`

### 2.2 Product Repository

- [x] Create `src/lib/features/products/server/repository.ts` — `listProducts()`, `getProductBySlug()`, `listCategories()`, `listCharms()`

### 2.3 Wire Up Products List Page (`/products`)

- [x] Update `src/routes/products/+page.server.ts` — load products + categories
- [x] Update `src/routes/products/+page.svelte` — real `ProductCard` components, real category filters

### 2.4 ProductCard Component

- [x] Create `src/lib/features/products/components/product-card.svelte`

### 2.5 Wire Up Product Detail Page (`/products/[slug]`)

- [x] Update `src/routes/products/[slug]/+page.server.ts` — load product by slug, 404 if not found
- [x] Update `src/routes/products/[slug]/+page.svelte` — real data, add to cart, PortableText, CharmScroll

### 2.6 PortableText Renderer

- [x] Create `src/lib/components/portable-text.svelte`

### 2.7 Charm Scroll Section

- [x] Create `src/lib/features/products/components/charm-scroll.svelte`

---

## Phase 3 — Cart Feature

### 3.1 Cart Types

- [x] Create `src/lib/features/cart/types.ts` — `CartItem`

### 3.2 Cart Store

- [x] Create `src/lib/features/cart/store.svelte.ts` — Svelte 5 `$state`, localStorage persistence, SSR-safe

### 3.3 Wire Up Cart Drawer Modal

- [x] Update `src/lib/components/modal-stack/cart-drawer-modal.svelte` — real cart data, qty controls, subtotal, checkout button

### 3.4 Wire Up Cart Page (`/cart`)

- [x] Update `src/routes/cart/+page.svelte` — mirrors drawer, full-page layout

### 3.5 Wire Up Quick-View Modal

- [x] Update `src/lib/components/modal-stack/product-quick-view-modal.svelte` — real `ProductListItem`, cart integration

### 3.6 Add-to-Cart Feedback

- [x] Cart badge in header shows `cart.itemCount`
- [x] Toast notification on add to cart via `svelte-sonner`

---

## Phase 3 — Verification

- [x] `pnpm run check` passes (0 errors)
- [x] `pnpm run lint` passes (0 errors)

---

## Phase 4 — Checkout Feature

### 4.1 Dependencies

- [ ] Install `stripe` and `@stripe/stripe-js`
- [ ] Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.example` and `.env.local`

### 4.2 Checkout Types

- [ ] Create `src/lib/features/checkout/types.ts` — `CheckoutLineItem`, `ShippingZone`

### 4.3 Shipping Zone Repository

- [ ] Create `src/lib/features/checkout/server/repository.ts` — `listShippingZones()`

### 4.4 Checkout Service

- [ ] Create `src/lib/features/checkout/server/service.ts`:
  - `createCheckoutSession(cartItems, successUrl, cancelUrl)`
  - Maps cart items → Stripe `line_items[]` via `stripePriceId`
  - Digital-only → no shipping; physical → shipping zone rates

### 4.5 Checkout Route

- [ ] Update `src/routes/checkout/+server.ts` — POST: parse cart, validate stock, create Stripe session, redirect

### 4.6 Order Success Page

- [ ] Update `src/routes/order/success/+page.server.ts` — verify Stripe session
- [ ] Update `src/routes/order/success/+page.svelte` — confirmation UI

---

## Phase 5 — Order Processing (Webhook)

### 5.1 Order Types

- [ ] Create `src/lib/features/orders/types.ts` — `OrderInput`, `LineItemSnapshot`

### 5.2 Order Repository

- [ ] Create `src/lib/features/orders/server/repository.ts` — `createOrder()`, `getOrderBySessionId()`

### 5.3 Stripe Webhook Route

- [ ] Create `src/routes/api/webhooks/stripe/+server.ts` — POST:
  - Verify Stripe signature
  - Handle `checkout.session.completed` (idempotent)
  - Create Sanity order doc, generate download tokens, send email

### 5.4 Download Token Repository

- [ ] Create `src/lib/features/downloads/server/repository.ts` — `createDownloadToken()`, `getDownloadToken()`, `markTokenDownloaded()`

### 5.5 Order Service

- [ ] Create `src/lib/features/orders/server/service.ts` — `processCheckoutSession()`

---

## Phase 6 — Digital Delivery

### 6.1 PDF Download Route

- [ ] Create `src/routes/api/download/[token]/+server.ts` — validate token, proxy PDF, mark downloaded

---

## Phase 7 — Email (Resend)

### 7.1 Email Service

- [ ] Install `resend`
- [ ] Create `src/lib/features/orders/server/email.ts` — `sendOrderConfirmation()` with download links

---

## Phase 8 — Polish & Verification

### 8.1 Pre-launch Checklist

- [x] `pnpm run check` passes
- [x] `pnpm run lint` passes
- [ ] Cart persists across page refreshes (localStorage)
- [ ] Digital-only cart skips shipping at checkout
- [ ] Physical cart shows shipping zone selection in Stripe
- [ ] Webhook processes successfully (test with Stripe CLI)
- [ ] Download link works for pattern purchases
- [ ] Download token expires correctly
- [ ] Order confirmation email sent and received
- [ ] Sanity Studio orders view shows correct data
- [ ] "View in Stripe" link on order document works
- [ ] Stock `= 0` + `allowBackorder = false` → sold out, can't add to cart
- [ ] Stock `= 0` + `allowBackorder = true` → backorder message, can still add
- [ ] 404 on unknown product slug
- [ ] `/studio` renders Sanity Studio

### 8.2 Stripe Product Sync

- [ ] All test products have `stripeProductId` and `stripePriceId` in Sanity
- [ ] All shipping zones have `stripeShippingRateId` in Sanity

---

## Notes

- EUR cents everywhere: Stripe and Sanity both store prices as integers (e.g. 1500 = €15.00)
- All physical products need stock tracking; digital (Patterns) do not
- Quick-view modal uses `@svelte-put/async-stack` — resolve with `{ added: boolean }`
- Charm scroll only appears on Bag PDPs — check `category.slug.current === "bags"`
- Sanity server client (`$lib/server/sanity/client.ts`) must never be imported client-side
- Use `const groq = String.raw` locally (named export removed from `@sanity/client` v7)
- `pnpm run sanity:typegen` must be re-run after any schema change
- Studio uses `renderStudio()` not `<SanityStudio>` (removed from `sanity` v5)
