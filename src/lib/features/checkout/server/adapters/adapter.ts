export interface LineItem {
	priceId: string;
	quantity: number;
	/** Display title (used by test adapter) */
	title?: string;
	/** Unit amount in EUR cents (used by test adapter to show real totals) */
	unitAmount?: number;
}

export interface CheckoutSessionParams {
	lineItems: LineItem[];
	successUrl: string;
	cancelUrl: string;
	metadata?: Record<string, string>;
}

export interface CheckoutSession {
	sessionId: string;
	url: string;
}

export interface WebhookEvent {
	id: string;
	type: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	metadata?: Record<string, string>;
}

export interface RefundParams {
	paymentId: string;
	amount?: number;
	reason?: string;
}

export interface Refund {
	refundId: string;
	amount: number;
	status: string;
}

export interface PaymentAdapter {
	readonly name: string;
	createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSession>;
	verifyWebhook(request: Request): Promise<boolean>;
	parseWebhook(request: Request): Promise<WebhookEvent>;
	refund(params: RefundParams): Promise<Refund>;
}
