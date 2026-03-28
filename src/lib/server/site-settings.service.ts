import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/db/schema';

const KEY = 'default';

const DEFAULT_SETTINGS = {
	settingKey: KEY,
	webName: 'Personal Blog',
	hero: {
		title: 'Welcome to My Blog',
		description: 'Thoughts, stories, and ideas about technology, design, and life.',
		imageUrl: '',
		ctaLabel: '',
		ctaHref: ''
	},
	background: '#f9fafb',
	fontFamily: 'Inter Variable, ui-sans-serif, system-ui, sans-serif',
	colorScheme: { primary: '#2563eb', secondary: '#64748b' }
};

export async function getSiteSettings() {
	const row = await db.query.siteSettings.findFirst({
		where: eq(siteSettings.settingKey, KEY)
	});
	if (row) return row;

	await db.insert(siteSettings).values({
		settingKey: KEY,
		webName: DEFAULT_SETTINGS.webName,
		hero: DEFAULT_SETTINGS.hero,
		background: DEFAULT_SETTINGS.background,
		fontFamily: DEFAULT_SETTINGS.fontFamily,
		colorScheme: DEFAULT_SETTINGS.colorScheme
	});

	const created = await db.query.siteSettings.findFirst({
		where: eq(siteSettings.settingKey, KEY)
	});
	return created!;
}

export async function updateSiteSettings(
	patch: Partial<{
		webName: string;
		hero: {
			title: string;
			description: string;
			imageUrl?: string;
			ctaLabel?: string;
			ctaHref?: string;
		};
		background: string;
		fontFamily: string;
		colorScheme: { primary: string; secondary: string };
	}>
) {
	const existing = await getSiteSettings();

	await db
		.update(siteSettings)
		.set({
			...(patch.webName !== undefined && { webName: patch.webName }),
			...(patch.hero !== undefined && {
				hero: { ...existing.hero, ...patch.hero }
			}),
			...(patch.background !== undefined && { background: patch.background }),
			...(patch.fontFamily !== undefined && { fontFamily: patch.fontFamily }),
			...(patch.colorScheme !== undefined && {
				colorScheme: { ...existing.colorScheme, ...patch.colorScheme }
			})
		})
		.where(eq(siteSettings.id, existing.id));
}
