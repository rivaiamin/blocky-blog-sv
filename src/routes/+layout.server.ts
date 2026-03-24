import { getSiteSettings } from '$lib/server/site-settings.service';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const site = await getSiteSettings();
	return {
		user: locals.user ?? null,
		session: locals.session ?? null,
		site
	};
};
