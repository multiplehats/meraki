import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processWebhook } from '$lib/features/checkout/server/webhooks';

export const POST: RequestHandler = async ({ request, params }) => {
	const { provider } = params;

	try {
		await processWebhook(request, provider);
		return json({ received: true });
	} catch (err) {
		console.error('Webhook error:', { provider, error: err instanceof Error ? err.message : err });

		const isSignatureError =
			err instanceof Error && err.message.includes('Invalid webhook signature');

		return json(
			{ error: isSignatureError ? 'Invalid webhook signature' : 'Processing failed' },
			{ status: isSignatureError ? 400 : 500 }
		);
	}
};
