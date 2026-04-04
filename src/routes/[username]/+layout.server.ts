import { error } from '@sveltejs/kit';
import { getTenantLayoutData } from '$lib/server/users.service';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const parentData = await parent();
	const tenant = await getTenantLayoutData(params.username);
	if (!tenant) throw error(404, 'Not found');
	return {
		tenantUser: tenant.tenantUser,
		site: tenant.site,
		user: parentData.user,
		session: parentData.session
	};
};
