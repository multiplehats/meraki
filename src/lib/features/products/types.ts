export type SanityImage = {
	_type: 'image';
	asset: { _ref: string; _type: 'reference' };
	hotspot?: { x: number; y: number; height: number; width: number };
	crop?: { top: number; bottom: number; left: number; right: number };
};

export type ProductAttribute = {
	key: string;
	value: string;
};

export type ProductCategory = {
	_id: string;
	name: string;
	slug: { current: string };
	isDigital: boolean;
};

export type Product = {
	_id: string;
	_type: 'product';
	_createdAt: string;
	_updatedAt: string;
	title: string;
	slug: { current: string };
	description?: Record<string, unknown>[];
	price: number;
	category?: ProductCategory;
	images: SanityImage[];
	attributes?: ProductAttribute[];
	stock: number;
	allowBackorder: boolean;
	backorderMessage?: string;
	stripeProductId?: string;
	stripePriceId?: string;
};

export type ProductListItem = {
	_id: string;
	title: string;
	slug: { current: string };
	price: number;
	images: SanityImage[];
	stock: number;
	allowBackorder: boolean;
	category?: {
		name: string;
		slug: { current: string };
		isDigital: boolean;
	};
};

export type ProductDetail = Product;

export type CategoryListItem = {
	_id: string;
	name: string;
	slug: { current: string };
};

export function formatPrice(cents: number): string {
	return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function stockStatus(product: Pick<ProductListItem, 'stock' | 'allowBackorder'>): {
	label: string;
	available: boolean;
} {
	if (product.stock > 0) return { label: 'In stock', available: true };
	if (product.allowBackorder) return { label: 'Made to order', available: true };
	return { label: 'Out of stock', available: false };
}
