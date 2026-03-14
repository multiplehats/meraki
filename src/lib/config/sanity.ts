import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

export const sanityClient = createClient({
	projectId: env.PUBLIC_SANITY_PROJECT_ID ?? '',
	dataset: env.PUBLIC_SANITY_DATASET ?? 'production',
	apiVersion: '2024-01-01',
	useCdn: true
});
