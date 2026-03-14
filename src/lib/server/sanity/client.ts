import { createClient } from '@sanity/client';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

export const sanityServerClient = createClient({
	projectId: publicEnv.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
	dataset: publicEnv.PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2024-01-01',
	useCdn: false,
	token: privateEnv.SANITY_API_TOKEN
});
