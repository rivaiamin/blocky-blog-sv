/** Shape used for tenant home hero (matches `site_settings.hero` JSON). */
export type SiteHeroDisplay = {
	title: string;
	description: string;
	coverImageUrl?: string;
	profileImageUrl?: string;
	/** Legacy cover; used when `coverImageUrl` is empty. */
	imageUrl?: string;
	ctaLabel?: string;
	ctaHref?: string;
};

/** Prefer `coverImageUrl`, fall back to legacy `imageUrl`. */
export function effectiveCoverImageUrl(hero: SiteHeroDisplay): string {
	const c = hero.coverImageUrl?.trim() ?? '';
	if (c) return c;
	return hero.imageUrl?.trim() ?? '';
}

export function initialsFromTitle(title: string): string {
	const t = title.trim();
	if (!t) return '?';
	const parts = t.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		const a = parts[0]![0];
		const b = parts[1]![0];
		if (a && b) return (a + b).toUpperCase();
	}
	return t.slice(0, 2).toUpperCase();
}
