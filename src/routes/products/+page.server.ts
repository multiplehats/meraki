import { listProducts, listCategories } from '$lib/features/products/server/repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const categorySlug = url.searchParams.get('category') ?? undefined;

	const [products, categories] = await Promise.all([
		listProducts({ categorySlug }),
		listCategories()
	]);

	return { products, categories, selectedCategory: categorySlug ?? null };
};
