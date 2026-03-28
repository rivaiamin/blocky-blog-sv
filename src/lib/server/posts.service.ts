import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { posts, type PostBlockRow } from '$lib/server/db/schema';
import type { PostOptions } from '$lib/types/post-options';

const initialBlocks = (): PostBlockRow[] => [
	{
		id: 'initial',
		type: 'paragraph',
		content: { text: 'Start writing...' },
		order: 0
	}
];

async function uniqueSlug(base: string) {
	let s = base || 'untitled';
	let i = 0;
	while (await db.query.posts.findFirst({ where: eq(posts.slug, s) })) {
		i += 1;
		s = `${base || 'untitled'}-${i}`;
	}
	return s;
}

export async function createPost(authorId: string, title: string) {
	const base = slugifyPostTitle(title) || 'untitled';
	const finalSlug = await uniqueSlug(base);
	const [row] = await db
		.insert(posts)
		.values({
			authorId,
			title,
			slug: finalSlug,
			published: false,
			blocks: initialBlocks()
		})
		.returning();
	return row;
}

export async function getPostByIdForUser(id: string, userId: string | undefined) {
	const row = await db.query.posts.findFirst({
		where: eq(posts.id, id)
	});
	if (!row) return null;
	if (!row.published && row.authorId !== userId) return null;
	return row;
}

export async function getPostBySlugPublic(slug: string) {
	const row = await db.query.posts.findFirst({
		where: and(eq(posts.slug, slug), eq(posts.published, true))
	});
	return row ?? null;
}

export async function getPublishedPosts() {
	return db.query.posts.findMany({
		where: eq(posts.published, true),
		orderBy: [desc(posts.createdAt)]
	});
}

export async function getPostsForAuthor(authorId: string) {
	return db.query.posts.findMany({
		where: eq(posts.authorId, authorId),
		orderBy: [desc(posts.createdAt)]
	});
}

export async function updatePost(
	id: string,
	authorId: string,
	patch: Partial<{
		title: string;
		excerpt: string | null;
		coverImage: string | null;
		/** Shallow-merged into existing row.options */
		options: Partial<PostOptions>;
		published: boolean;
		blocks: PostBlockRow[];
		slug: string;
	}>
) {
	const row = await db.query.posts.findFirst({ where: eq(posts.id, id) });
	if (!row || row.authorId !== authorId) throw new Error('Post not found or unauthorized');

	await db
		.update(posts)
		.set({
			...(patch.title !== undefined && { title: patch.title }),
			...(patch.excerpt !== undefined && { excerpt: patch.excerpt }),
			...(patch.coverImage !== undefined && { coverImage: patch.coverImage }),
			...(patch.options !== undefined && {
				options: { ...(row.options ?? {}), ...patch.options } as PostOptions
			}),
			...(patch.published !== undefined && { published: patch.published }),
			...(patch.blocks !== undefined && { blocks: patch.blocks }),
			...(patch.slug !== undefined && { slug: patch.slug })
		})
		.where(eq(posts.id, id));
}

export async function deletePost(id: string, authorId: string) {
	const row = await db.query.posts.findFirst({ where: eq(posts.id, id) });
	if (!row || row.authorId !== authorId) throw new Error('Post not found or unauthorized');
	await db.delete(posts).where(eq(posts.id, id));
}

export function slugifyPostTitle(title: string) {
	const s = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
	return s;
}
