import { getProductBySlug, listCharms } from '$lib/features/products/server/repository';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [product, charms] = await Promise.all([getProductBySlug(params.slug), listCharms()]);

	if (!product) error(404, 'Product not found');

	return { product, charms };
};
