import { getPaymentSystem } from './system';
import { env } from '$env/dynamic/private';
import type { CartItem } from '$lib/features/cart/types';

export interface CheckoutParams {
	items: CartItem[];
	successUrl: string;
	cancelUrl: string;
	customerEmail?: string;
}

export async function createCheckoutSession(params: CheckoutParams) {
	const provider = env.PAYMENT_ADAPTER ?? 'test';
	const paymentSystem = getPaymentSystem();
	const adapter = paymentSystem.getAdapter(provider);

	const requiresShipping = params.items.some((item) => !item.isDigital);
	const totalCents = params.items.reduce((sum, item) => sum + item.price * item.qty, 0);

	// Metadata carries cart data through to the webhook handler
	const metadata: Record<string, string> = {
		items: JSON.stringify(params.items),
		totalCents: String(totalCents),
		requiresShipping: String(requiresShipping)
	};
	if (params.customerEmail) {
		metadata.customerEmail = params.customerEmail;
	}

	const lineItems = params.items.map((item) => ({
		// Stripe uses stripePriceId; test adapter ignores priceId but uses unitAmount
		priceId: item.productId,
		quantity: item.qty,
		title: item.title,
		unitAmount: item.price
	}));

	return adapter.createCheckoutSession({
		lineItems,
		successUrl: params.successUrl,
		cancelUrl: params.cancelUrl,
		metadata
	});
}
