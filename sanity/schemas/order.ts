import { defineField, defineType } from 'sanity';

export const order = defineType({
	name: 'order',
	title: 'Order',
	type: 'document',
	fields: [
		defineField({ name: 'stripeSessionId', type: 'string' }),
		defineField({ name: 'stripePaymentIntentId', type: 'string' }),
		defineField({
			name: 'status',
			type: 'string',
			options: { list: ['pending', 'paid', 'fulfilled', 'cancelled'] }
		}),
		defineField({ name: 'customerEmail', type: 'string' }),
		defineField({ name: 'customerName', type: 'string' }),
		defineField({
			name: 'lineItems',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }] }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'price', type: 'number' }),
						defineField({ name: 'qty', type: 'number' })
					]
				}
			]
		}),
		defineField({ name: 'totalAmount', type: 'number' }),
		defineField({
			name: 'shippingAddress',
			type: 'object',
			fields: [
				defineField({ name: 'line1', type: 'string' }),
				defineField({ name: 'line2', type: 'string' }),
				defineField({ name: 'city', type: 'string' }),
				defineField({ name: 'country', type: 'string' }),
				defineField({ name: 'postalCode', type: 'string' })
			]
		})
	]
});
