import { createClient, type SanityClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
	if (!_client) {
		_client = createClient({
			projectId: env.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
			dataset: env.PUBLIC_SANITY_DATASET || 'production',
			apiVersion: '2024-01-01',
			useCdn: true
		});
	}
	return _client;
}

// Convenience singleton — only created on first access at request time
export const sanityClient: SanityClient = new Proxy({} as SanityClient, {
	get(_, prop) {
		return getSanityClient()[prop as keyof SanityClient];
	}
});
