/**
 * Test Payment Adapter
 *
 * No-op adapter for development and staging. Simulates payment processing
 * without requiring real credentials.
 *
 * Usage: Set PAYMENT_ADAPTER=test (or leave unset — it's the default)
 * Visit the checkout URL to simulate success or failure.
 *
 * WARNING: Never use in production with real orders.
 */

import type {
	PaymentAdapter,
	CheckoutSessionParams,
	CheckoutSession,
	RefundParams,
	Refund,
	WebhookEvent
} from './adapter';

const sessions = new Map<
	string,
	{
		sessionId: string;
		lineItems: CheckoutSessionParams['lineItems'];
		successUrl: string;
		cancelUrl: string;
		metadata: Record<string, string>;
		totalCents: number;
		status: 'pending' | 'completed' | 'cancelled';
		createdAt: Date;
	}
>();

let counter = 0;
function generateId(prefix: string) {
	return `${prefix}_${Date.now()}_${++counter}`;
}

export class TestAdapter implements PaymentAdapter {
	readonly name = 'test';

	async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSession> {
		const sessionId = generateId('test_session');

		const totalCents = params.lineItems.reduce((sum, item) => {
			return sum + (item.unitAmount ?? 0) * item.quantity;
		}, 0);

		sessions.set(sessionId, {
			sessionId,
			lineItems: params.lineItems,
			successUrl: params.successUrl,
			cancelUrl: params.cancelUrl,
			metadata: params.metadata ?? {},
			totalCents,
			status: 'pending',
			createdAt: new Date()
		});

		return {
			sessionId,
			url: `/api/checkout/test/${sessionId}`
		};
	}

	async verifyWebhook(request: Request): Promise<boolean> {
		// In dev/test mode, accept auto-triggered webhooks without signature
		const signature = request.headers.get('x-test-signature');
		return signature === 'auto-triggered' || !!signature;
	}

	async parseWebhook(request: Request): Promise<WebhookEvent> {
		const body = await request.text();
		const event = JSON.parse(body);
		return {
			id: event.id ?? `test_event_${Date.now()}`,
			type: event.type,
			data: event.data,
			metadata: event.metadata ?? {}
		};
	}

	async refund(_params: RefundParams): Promise<Refund> {
		return {
			refundId: generateId('test_refund'),
			amount: _params.amount ?? 0,
			status: 'succeeded'
		};
	}

	getSession(sessionId: string) {
		return sessions.get(sessionId);
	}

	completeSession(sessionId: string) {
		const session = sessions.get(sessionId);
		if (session) {
			session.status = 'completed';
			sessions.set(sessionId, session);
		}
	}

	cancelSession(sessionId: string) {
		const session = sessions.get(sessionId);
		if (session) {
			session.status = 'cancelled';
			sessions.set(sessionId, session);
		}
	}

	static createWebhookEvent(
		type: 'success' | 'failed',
		sessionId: string,
		metadata: Record<string, string>,
		totalCents: number
	): WebhookEvent {
		const eventTypeMap = {
			success: 'payment.succeeded',
			failed: 'payment.failed'
		};

		return {
			id: `test_event_${Date.now()}`,
			type: eventTypeMap[type],
			data: {
				id: `test_payment_${sessionId}`,
				session_id: sessionId,
				amount: totalCents,
				currency: 'eur',
				status: type === 'success' ? 'succeeded' : 'failed'
			},
			metadata
		};
	}
}
