import imageUrlBuilder from '@sanity/image-url';
import { getSanityClient } from '$lib/config/sanity';

export function urlFor(source: Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]) {
	return imageUrlBuilder(getSanityClient()).image(source);
}
