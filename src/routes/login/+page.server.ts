import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import {
	assertUsernameAvailable,
	isValidUsernameFormat,
	normalizeUsername,
	RESERVED_USERNAMES
} from '$lib/server/username';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/');
	return {};
};

export const actions: Actions = {
	signInEmail: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL: '/'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Sign in failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		throw redirect(302, '/dashboard');
	},
	signUpEmail: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? '';
		const usernameRaw = formData.get('username')?.toString() ?? '';

		let username: string | undefined;
		if (usernameRaw.trim()) {
			const u = normalizeUsername(usernameRaw);
			if (!isValidUsernameFormat(u)) {
				return fail(400, { message: 'Invalid username format' });
			}
			if (RESERVED_USERNAMES.has(u)) {
				return fail(400, { message: 'This username is reserved' });
			}
			try {
				await assertUsernameAvailable(u);
			} catch {
				return fail(400, { message: 'Username is already taken' });
			}
			username = u;
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name,
					...(username !== undefined && { username }),
					callbackURL: '/'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Registration failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		throw redirect(302, '/dashboard');
	}
};
