import { defineField, defineType } from 'sanity';

export const taxConfig = defineType({
	name: 'taxConfig',
	title: 'Tax Configuration',
	type: 'document',
	fields: [defineField({ name: 'stripeTaxEnabled', type: 'boolean', initialValue: false })]
});
