import { defineField, defineType } from 'sanity';

export const category = defineType({
	name: 'category',
	title: 'Category',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'name' },
			validation: (r) => r.required()
		}),
		defineField({ name: 'description', type: 'text' }),
		defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
		defineField({ name: 'isDigital', type: 'boolean', initialValue: false })
	]
});
