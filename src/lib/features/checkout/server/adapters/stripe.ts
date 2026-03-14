/**
 * Stripe Payment Adapter
 *
 * Production adapter using Stripe Checkout.
 * Requires STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET env vars.
 */

import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import type {
	PaymentAdapter,
	CheckoutSessionParams,
	CheckoutSession,
	WebhookEvent,
	RefundParams,
	Refund
} from './adapter';

export class StripeAdapter implements PaymentAdapter {
	readonly name = 'stripe';
	private stripe: Stripe;

	constructor() {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY ?? '');
	}

	async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSession> {
		const session = await this.stripe.checkout.sessions.create({
			mode: 'payment',
			line_items: params.lineItems.map((item) => ({
				price: item.priceId,
				quantity: item.quantity
			})),
			success_url: params.successUrl,
			cancel_url: params.cancelUrl,
			metadata: params.metadata,
			// Collect customer email
			customer_email: params.metadata?.customerEmail,
			// Collect shipping for physical products (determined by handler)
			...(params.metadata?.requiresShipping === 'true'
				? { shipping_address_collection: { allowed_countries: ['NL', 'BE', 'DE', 'FR', 'GB'] } }
				: {})
		});

		return {
			sessionId: session.id,
			url: session.url ?? ''
		};
	}

	async verifyWebhook(request: Request): Promise<boolean> {
		const sig = request.headers.get('stripe-signature') ?? '';
		const body = await request.clone().text();
		try {
			this.stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET ?? '');
			return true;
		} catch {
			return false;
		}
	}

	async parseWebhook(request: Request): Promise<WebhookEvent> {
		const sig = request.headers.get('stripe-signature') ?? '';
		const body = await request.text();
		const event = this.stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET ?? '');

		const obj = event.data.object as unknown as Record<string, unknown>;

		return {
			id: event.id,
			type: event.type,
			data: obj,
			metadata: (obj.metadata as Record<string, string>) ?? {}
		};
	}

	async refund(params: RefundParams): Promise<Refund> {
		const refund = await this.stripe.refunds.create({
			payment_intent: params.paymentId,
			...(params.amount ? { amount: params.amount } : {}),
			reason: 'requested_by_customer'
		});

		return {
			refundId: refund.id,
			amount: refund.amount,
			status: refund.status ?? 'unknown'
		};
	}
}
