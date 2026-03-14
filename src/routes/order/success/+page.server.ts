import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');
	return { sessionId };
};
