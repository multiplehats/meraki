import { createClient, type SanityClient } from '@sanity/client';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

let _client: SanityClient | null = null;

export function getSanityServerClient(): SanityClient {
	if (!_client) {
		_client = createClient({
			projectId: publicEnv.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
			dataset: publicEnv.PUBLIC_SANITY_DATASET || 'production',
			apiVersion: '2024-01-01',
			useCdn: false,
			token: privateEnv.SANITY_API_TOKEN
		});
	}
	return _client;
}

export const sanityServerClient: SanityClient = new Proxy({} as SanityClient, {
	get(_, prop) {
		return getSanityServerClient()[prop as keyof SanityClient];
	}
});
