import { fail } from '@sveltejs/kit';
import { getSiteSettings, updateSiteSettings } from '$lib/server/site-settings.service';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await getSiteSettings();
	return { settings };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const fd = await request.formData();
		const webName = String(fd.get('webName') ?? '').trim();
		if (!webName) return fail(400, { message: 'Web name required' });

		await updateSiteSettings({
			webName,
			hero: {
				title: String(fd.get('heroTitle') ?? ''),
				description: String(fd.get('heroDescription') ?? ''),
				imageUrl: String(fd.get('heroImageUrl') ?? ''),
				ctaLabel: String(fd.get('ctaLabel') ?? ''),
				ctaHref: String(fd.get('ctaHref') ?? '')
			},
			background: String(fd.get('background') ?? ''),
			fontFamily: String(fd.get('fontFamily') ?? ''),
			colorScheme: {
				primary: String(fd.get('colorPrimary') ?? ''),
				secondary: String(fd.get('colorSecondary') ?? '')
			}
		});

		return { success: true };
	}
};
