import { defineField, defineType } from 'sanity';

export const product = defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (r) => r.required()
		}),
		defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
		defineField({
			name: 'price',
			type: 'number',
			description: 'Price in euro cents (e.g., 2500 = €25.00)',
			validation: (r) => r.required().positive()
		}),
		defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }] }),
		defineField({
			name: 'images',
			type: 'array',
			of: [{ type: 'image', options: { hotspot: true } }]
		}),
		defineField({
			name: 'attributes',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'key', type: 'string' }),
						defineField({ name: 'value', type: 'string' })
					]
				}
			]
		}),
		defineField({ name: 'stock', type: 'number', initialValue: 0 }),
		defineField({ name: 'allowBackorder', type: 'boolean', initialValue: false }),
		defineField({ name: 'backorderMessage', type: 'string' }),
		defineField({ name: 'pdfAsset', type: 'file', options: { accept: '.pdf' } }),
		defineField({ name: 'stripeProductId', type: 'string' }),
		defineField({ name: 'stripePriceId', type: 'string' })
	]
});
