import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPaymentSystem } from '$lib/features/checkout/server/system';
import { TestAdapter } from '$lib/features/checkout/server/adapters/test';

export const GET: RequestHandler = async ({ params }) => {
	const { sessionId } = params;

	const paymentSystem = getPaymentSystem();
	const adapter = paymentSystem.getAdapter('test');

	if (!(adapter instanceof TestAdapter)) {
		throw error(500, 'Test adapter not available');
	}

	const session = adapter.getSession(sessionId);
	if (!session) throw error(404, 'Session not found');
	if (session.status !== 'pending') throw error(400, `Session already ${session.status}`);

	const amountEur = (session.totalCents / 100).toFixed(2);
	const itemCount = session.lineItems.length;

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Test Checkout — Merak'i</title>
	<style>
		*{margin:0;padding:0;box-sizing:border-box}
		body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#faf9f7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
		.card{background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:440px;width:100%;padding:40px}
		.badge{display:inline-block;background:#f59e0b;color:white;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-bottom:24px}
		h1{font-size:24px;font-weight:700;color:#111;margin-bottom:4px}
		.sub{color:#6b7280;font-size:14px;margin-bottom:28px}
		.summary{background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:28px}
		.row{display:flex;justify-content:space-between;font-size:14px;color:#4b5563;margin-bottom:10px}
		.row:last-child{margin-bottom:0;padding-top:12px;border-top:1px solid #e5e7eb;font-weight:700;font-size:16px;color:#111}
		.btn{width:100%;padding:14px;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:10px;transition:opacity .15s}
		.btn:hover{opacity:.9}.btn:disabled{opacity:.5;cursor:not-allowed}
		.btn-success{background:#111;color:white}
		.btn-fail{background:white;color:#ef4444;border:1.5px solid #ef4444}
		.btn-cancel{background:white;color:#9ca3af;border:1.5px solid #e5e7eb;margin-bottom:0}
		.note{margin-top:20px;padding:14px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:6px;font-size:13px;color:#92400e}
	</style>
</head>
<body>
	<div class="card">
		<div class="badge">Test Mode</div>
		<h1>Merak'i Checkout</h1>
		<p class="sub">Simulate a payment — no real charge will occur</p>
		<div class="summary">
			<div class="row"><span>Items</span><span>${itemCount} item${itemCount !== 1 ? 's' : ''}</span></div>
			<div class="row"><span>Total</span><span>€${amountEur}</span></div>
		</div>
		<button class="btn btn-success" onclick="simulate('success')">Pay €${amountEur}</button>
		<button class="btn btn-fail" onclick="simulate('failed')">Simulate Failed Payment</button>
		<button class="btn btn-cancel" onclick="simulate('cancel')">Cancel</button>
		<div class="note"><strong>Test mode:</strong> Choose an option to test the payment flow.</div>
	</div>
	<script>
		async function simulate(action) {
			document.querySelectorAll('.btn').forEach(b => b.disabled = true);
			try {
				const res = await fetch(window.location.pathname, {
					method: 'POST',
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify({action})
				});
				const {redirectUrl} = await res.json();
				window.location.href = redirectUrl;
			} catch(e) {
				document.querySelectorAll('.btn').forEach(b => b.disabled = false);
				alert('Error: ' + e.message);
			}
		}
	</script>
</body>
</html>`;

	return new Response(html, { headers: { 'Content-Type': 'text/html' } });
};

export const POST: RequestHandler = async ({ params, request }) => {
	const { sessionId } = params;
	const { action } = await request.json();

	const paymentSystem = getPaymentSystem();
	const adapter = paymentSystem.getAdapter('test');

	if (!(adapter instanceof TestAdapter)) {
		throw error(500, 'Test adapter not available');
	}

	const session = adapter.getSession(sessionId);
	if (!session) throw error(404, 'Session not found');

	const baseUrl = new URL(request.url).origin;

	if (action === 'success') {
		adapter.completeSession(sessionId);

		const webhookEvent = TestAdapter.createWebhookEvent(
			'success',
			sessionId,
			session.metadata,
			session.totalCents
		);

		// Auto-trigger webhook processing
		fetch(`${baseUrl}/api/webhooks/test`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-test-signature': 'auto-triggered' },
			body: JSON.stringify(webhookEvent)
		}).catch((err) => console.error('Failed to trigger test webhook:', err));

		return new Response(JSON.stringify({ redirectUrl: session.successUrl }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (action === 'failed') {
		adapter.cancelSession(sessionId);
		const cancelUrl = new URL(session.cancelUrl);
		cancelUrl.searchParams.set('error', 'payment_failed');
		return new Response(JSON.stringify({ redirectUrl: cancelUrl.toString() }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (action === 'cancel') {
		adapter.cancelSession(sessionId);
		return new Response(JSON.stringify({ redirectUrl: session.cancelUrl }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	throw error(400, 'Invalid action');
};
