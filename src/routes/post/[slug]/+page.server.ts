import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw error(
		404,
		'Posts now live at /{author}/post/{slug}. Open an author from the home page and use their post link.'
	);
};
