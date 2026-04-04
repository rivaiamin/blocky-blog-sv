import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';

/** First path segment must not collide with static routes */
export const RESERVED_USERNAMES = new Set([
	'',
	'api',
	'demo',
	'login',
	'logout',
	'settings',
	'dashboard',
	'post',
	'edit',
	'setup-username',
	'favicon.ico',
	'robots.txt',
	'sitemap.xml'
]);

const USERNAME_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;

export function normalizeUsername(raw: string): string {
	return raw.trim().toLowerCase();
}

export function isValidUsernameFormat(u: string): boolean {
	return USERNAME_RE.test(u);
}

export async function assertUsernameAvailable(username: string, exceptUserId?: string) {
	const row = await db.query.user.findFirst({
		where: eq(user.username, username)
	});
	if (row && row.id !== exceptUserId) {
		throw new Error('Username is already taken');
	}
}

export async function setUsernameForUser(userId: string, raw: string) {
	const username = normalizeUsername(raw);
	if (!username) throw new Error('Username is required');
	if (!isValidUsernameFormat(username)) {
		throw new Error(
			'Use 2–32 characters: lowercase letters, digits, hyphens (no leading/trailing hyphen)'
		);
	}
	if (RESERVED_USERNAMES.has(username)) throw new Error('This username is reserved');
	await assertUsernameAvailable(username, userId);
	await db.update(user).set({ username }).where(eq(user.id, userId));
}
