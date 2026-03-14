import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from '$lib/config/sanity';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
	return builder.image(source);
}
