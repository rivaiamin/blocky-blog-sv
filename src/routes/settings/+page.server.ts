import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	const u = locals.user.username;
	if (!u) throw redirect(302, '/setup-username');
	throw redirect(302, `/${u}/settings`);
};
