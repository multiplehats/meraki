import { defineField, defineType } from 'sanity';

export const downloadToken = defineType({
	name: 'downloadToken',
	title: 'Download Token',
	type: 'document',
	fields: [
		defineField({ name: 'token', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }] }),
		defineField({ name: 'order', type: 'reference', to: [{ type: 'order' }] }),
		defineField({ name: 'expiresAt', type: 'datetime' }),
		defineField({ name: 'downloadedAt', type: 'datetime' })
	]
});
