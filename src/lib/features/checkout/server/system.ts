import type { PaymentAdapter } from './adapters/adapter';
import { TestAdapter } from './adapters/test';
import { StripeAdapter } from './adapters/stripe';
import { env } from '$env/dynamic/private';

export type PaymentHandler = (ctx: PaymentContext) => Promise<void>;

export interface PaymentContext {
	event: {
		id: string;
		type: string;
		provider: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: any;
		metadata?: Record<string, string>;
	};
	provider: string;
}

class PaymentSystem {
	private adapters = new Map<string, PaymentAdapter>();
	private handlers = new Map<string, PaymentHandler[]>();

	constructor() {
		this.registerAdapter(new TestAdapter());
		if (env.STRIPE_SECRET_KEY) {
			this.registerAdapter(new StripeAdapter());
		}
	}

	registerAdapter(adapter: PaymentAdapter) {
		this.adapters.set(adapter.name, adapter);
	}

	getAdapter(provider: string): PaymentAdapter {
		const adapter = this.adapters.get(provider);
		if (!adapter) {
			throw new Error(`Payment adapter not found: ${provider}`);
		}
		return adapter;
	}

	on(eventType: string, handler: PaymentHandler) {
		const handlers = this.handlers.get(eventType) ?? [];
		handlers.push(handler);
		this.handlers.set(eventType, handlers);
	}

	async emit(eventType: string, ctx: PaymentContext) {
		const handlers = this.handlers.get(eventType) ?? [];
		for (const handler of handlers) {
			try {
				await handler(ctx);
			} catch (error) {
				console.error(`Error in payment handler for ${eventType}:`, error);
				throw error;
			}
		}
	}
}

let paymentSystem: PaymentSystem;

export function getPaymentSystem(): PaymentSystem {
	if (!paymentSystem) {
		paymentSystem = new PaymentSystem();
	}
	return paymentSystem;
}
