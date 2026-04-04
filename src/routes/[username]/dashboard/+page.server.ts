import { fail, redirect } from '@sveltejs/kit';
import { createPost, deletePost, getPostsForAuthor } from '$lib/server/posts.service';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const posts = await getPostsForAuthor(locals.user!.id);
	return { posts };
};

export const actions: Actions = {
	create: async ({ request, locals, params }) => {
		const fd = await request.formData();
		const title = String(fd.get('title') ?? '').trim();
		if (!title) return fail(400, { message: 'Title required' });
		const post = await createPost(locals.user!.id, title);
		throw redirect(303, `/${params.username}/edit/${post.id}`);
	},
	delete: async ({ request, locals }) => {
		const fd = await request.formData();
		const id = String(fd.get('id') ?? '');
		if (!id) return fail(400, { message: 'Missing id' });
		await deletePost(id, locals.user!.id);
		return { success: true };
	}
};
