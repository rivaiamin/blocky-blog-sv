import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	if (!locals.user) throw redirect(302, '/login');
	const { tenantUser } = await parent();
	if (locals.user.id !== tenantUser.id) throw error(403, 'Forbidden');
	return {};
};
