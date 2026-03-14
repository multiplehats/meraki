import { getPaymentSystem } from './system';
import { sanityServerClient } from '$lib/server/sanity/client';
import type { CartItem } from '$lib/features/cart/types';
import type { WebhookEvent } from './adapters/adapter';

export async function processWebhook(request: Request, provider: string): Promise<void> {
	const paymentSystem = getPaymentSystem();
	const adapter = paymentSystem.getAdapter(provider);

	const isValid = await adapter.verifyWebhook(request);
	if (!isValid) {
		throw new Error('Invalid webhook signature');
	}

	const event = await adapter.parseWebhook(request);

	const normalizedType = normalizeEventType(event.type, provider);

	switch (normalizedType) {
		case 'payment.succeeded':
			await handlePaymentSucceeded(event, provider);
			break;
		case 'payment.failed':
			console.log('Payment failed:', { provider, eventId: event.id });
			break;
		default:
			console.log('Unhandled webhook event:', { type: event.type, provider });
	}
}

function normalizeEventType(eventType: string, provider: string): string {
	if (provider === 'stripe') {
		const map: Record<string, string> = {
			'checkout.session.completed': 'payment.succeeded',
			'payment_intent.payment_failed': 'payment.failed'
		};
		return map[eventType] ?? eventType;
	}
	// test adapter already uses normalized types
	return eventType;
}

async function handlePaymentSucceeded(event: WebhookEvent, provider: string): Promise<void> {
	const metadata = event.metadata ?? {};
	const itemsJson = metadata.items;
	if (!itemsJson) {
		console.error('No items in webhook metadata', { eventId: event.id });
		return;
	}

	const items: CartItem[] = JSON.parse(itemsJson);
	const totalCents = parseInt(metadata.totalCents ?? '0', 10);
	const sessionId = event.data?.session_id ?? event.data?.id ?? event.id;

	// Idempotency: skip if this session was already processed
	const existing = await sanityServerClient.fetch(
		`*[_type == "order" && stripeSessionId == $sessionId][0]{ _id }`,
		{ sessionId }
	);
	if (existing) {
		console.log('Order already processed for session', sessionId);
		return;
	}

	// Create order in Sanity
	await sanityServerClient.create({
		_type: 'order',
		stripeSessionId: sessionId,
		stripePaymentIntentId: event.data?.payment_intent ?? null,
		status: 'paid',
		customerEmail: metadata.customerEmail ?? null,
		lineItems: items.map((item) => ({
			_key: item.productId,
			title: item.title,
			price: item.price,
			qty: item.qty,
			productRef: { _type: 'reference', _ref: item.productId }
		})),
		totalAmount: totalCents,
		createdAt: new Date().toISOString()
	});

	console.log('Order created in Sanity for session', sessionId);

	// Emit for any custom handlers
	const paymentSystem = getPaymentSystem();
	await paymentSystem.emit('payment.succeeded', {
		event: { id: event.id, type: event.type, provider, data: event.data, metadata },
		provider
	});
}
