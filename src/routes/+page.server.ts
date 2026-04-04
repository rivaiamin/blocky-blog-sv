import { listAuthorsWithSites } from '$lib/server/users.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const authors = await listAuthorsWithSites();
	return { authors };
};
