import { fail, redirect } from '@sveltejs/kit';
import { normalizeUsername, setUsernameForUser } from '$lib/server/username';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (locals.user.username) throw redirect(302, `/${locals.user.username}/dashboard`);
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const fd = await request.formData();
		const raw = String(fd.get('username') ?? '');
		try {
			await setUsernameForUser(locals.user!.id, raw);
		} catch (e) {
			return fail(400, { message: e instanceof Error ? e.message : 'Invalid username' });
		}
		const u = normalizeUsername(raw);
		throw redirect(303, `/${u}/dashboard`);
	}
};
