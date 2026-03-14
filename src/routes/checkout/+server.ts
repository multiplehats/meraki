import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCheckoutSession } from '$lib/features/checkout/server/service';
import type { CartItem } from '$lib/features/cart/types';

export const POST: RequestHandler = async ({ request, url }) => {
	let items: CartItem[], successUrl: string, cancelUrl: string, customerEmail: string | undefined;

	try {
		const body = await request.json();
		items = body.items;
		successUrl = body.successUrl ?? `${url.origin}/order/success`;
		cancelUrl = body.cancelUrl ?? `${url.origin}/cart`;
		customerEmail = body.customerEmail;
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!items?.length) {
		throw error(400, 'Cart is empty');
	}

	try {
		const session = await createCheckoutSession({ items, successUrl, cancelUrl, customerEmail });
		return json({ url: session.url, sessionId: session.sessionId });
	} catch (err) {
		console.error('Checkout error:', err);
		throw error(500, 'Failed to create checkout session');
	}
};
