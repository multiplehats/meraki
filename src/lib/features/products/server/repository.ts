import { sanityClient } from '$lib/config/sanity';

// groq tag is for editor syntax highlighting only
const groq = String.raw;
import type { Product, ProductListItem, CategoryListItem } from '../types';

const productListFields = groq`
  _id,
  title,
  slug,
  price,
  stock,
  allowBackorder,
  images[]{
    _type,
    asset,
    hotspot,
    crop
  },
  category->{
    name,
    slug,
    isDigital
  }
`;

export async function listProducts(filters?: {
	categorySlug?: string;
}): Promise<ProductListItem[]> {
	const categoryFilter = filters?.categorySlug ? `&& category->slug.current == $categorySlug` : '';

	return await sanityClient.fetch(
		groq`*[_type == "product" ${categoryFilter}] | order(_createdAt desc) {
      ${productListFields}
    }`,
		{ categorySlug: filters?.categorySlug ?? null }
	);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
	return (
		(await sanityClient.fetch(
			groq`*[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      price,
      stock,
      allowBackorder,
      backorderMessage,
      stripeProductId,
      stripePriceId,
      images[]{
        _type,
        asset,
        hotspot,
        crop
      },
      attributes[]{
        key,
        value
      },
      category->{
        _id,
        name,
        slug,
        isDigital
      }
    }`,
			{ slug }
		)) ?? null
	);
}

export async function listCategories(): Promise<CategoryListItem[]> {
	return await sanityClient.fetch(
		groq`*[_type == "category"] | order(name asc) {
      _id,
      name,
      slug
    }`
	);
}

export async function listCharms(): Promise<ProductListItem[]> {
	return await sanityClient.fetch(
		groq`*[_type == "product" && category->slug.current == "charms"] | order(_createdAt desc) {
      ${productListFields}
    }`
	);
}
