import { desc, eq, isNotNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { siteSettings } from '$lib/server/db/schema';
import { RESERVED_USERNAMES, normalizeUsername } from '$lib/server/username';
import { getSiteSettingsForUser } from '$lib/server/site-settings.service';

export async function getUserByUsername(usernameRaw: string) {
	const username = normalizeUsername(usernameRaw);
	if (!username || RESERVED_USERNAMES.has(username)) return null;
	const row = await db.query.user.findFirst({
		where: eq(user.username, username)
	});
	return row ?? null;
}

export type AuthorDirectoryEntry = {
	username: string;
	name: string;
	webName: string;
};

/** Users with a public username, for the home directory */
export async function listAuthorsWithSites(): Promise<AuthorDirectoryEntry[]> {
	const rows = await db
		.select({
			username: user.username,
			name: user.name,
			webName: siteSettings.webName
		})
		.from(user)
		.leftJoin(siteSettings, eq(siteSettings.userId, user.id))
		.where(isNotNull(user.username))
		.orderBy(desc(user.createdAt));

	const out: AuthorDirectoryEntry[] = [];
	for (const r of rows) {
		if (!r.username || RESERVED_USERNAMES.has(r.username)) continue;
		out.push({
			username: r.username,
			name: r.name,
			webName: r.webName ?? 'Personal Blog'
		});
	}
	return out;
}

export async function getTenantLayoutData(usernameRaw: string) {
	const tenantUser = await getUserByUsername(usernameRaw);
	if (!tenantUser?.username) return null;
	const site = await getSiteSettingsForUser(tenantUser.id);
	return { tenantUser, site };
}
