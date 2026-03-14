import { defineField, defineType } from 'sanity';

export const shippingZone = defineType({
	name: 'shippingZone',
	title: 'Shipping Zone',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'countries', type: 'array', of: [{ type: 'string' }] }),
		defineField({ name: 'price', type: 'number', validation: (r) => r.required() }),
		defineField({ name: 'stripeShippingRateId', type: 'string' })
	]
});
