import { and, count, desc, eq } from 'drizzle-orm';
import type { CommentWithAuthor } from '$lib/types/social';
import { db } from '$lib/server/db';
import { authorFollows, postComments, postLikes, posts, user } from '$lib/server/db/schema';

const MAX_COMMENT_LENGTH = 4000;
const MAX_COMMENTS_LIST = 100;

export type { CommentWithAuthor };

async function assertPublishedPost(postId: string) {
	const row = await db.query.posts.findFirst({
		where: and(eq(posts.id, postId), eq(posts.published, true)),
		columns: { id: true }
	});
	return row !== undefined;
}

export async function getCommentCountForPublishedPost(postId: string): Promise<number> {
	const ok = await assertPublishedPost(postId);
	if (!ok) return 0;
	const [row] = await db
		.select({ n: count() })
		.from(postComments)
		.where(eq(postComments.postId, postId));
	return Number(row?.n ?? 0);
}

export async function listCommentsForPublishedPost(postId: string): Promise<CommentWithAuthor[]> {
	const ok = await assertPublishedPost(postId);
	if (!ok) return [];

	const rows = await db
		.select({
			id: postComments.id,
			body: postComments.body,
			createdAt: postComments.createdAt,
			userId: postComments.userId,
			name: user.name,
			username: user.username,
			image: user.image
		})
		.from(postComments)
		.innerJoin(user, eq(postComments.userId, user.id))
		.where(eq(postComments.postId, postId))
		.orderBy(desc(postComments.createdAt))
		.limit(MAX_COMMENTS_LIST);

	// Show oldest-first for reading order
	return rows.reverse().map((r) => ({
		id: r.id,
		body: r.body,
		createdAt: r.createdAt,
		author: {
			id: r.userId,
			name: r.name,
			username: r.username,
			image: r.image
		}
	}));
}

export function validateCommentBody(raw: string): { ok: true; body: string } | { ok: false; error: string } {
	const body = raw.trim();
	if (!body) return { ok: false, error: 'Comment cannot be empty' };
	if (body.length > MAX_COMMENT_LENGTH) {
		return { ok: false, error: `Comment must be at most ${MAX_COMMENT_LENGTH} characters` };
	}
	return { ok: true, body };
}

export async function addComment(
	postId: string,
	userId: string,
	rawBody: string
): Promise<{ ok: true } | { ok: false; error: string }> {
	const validated = validateCommentBody(rawBody);
	if (!validated.ok) return validated;

	const ok = await assertPublishedPost(postId);
	if (!ok) return { ok: false, error: 'Post not found' };

	await db.insert(postComments).values({
		postId,
		userId,
		body: validated.body
	});
	return { ok: true };
}

export async function getLikeSummary(postId: string, viewerUserId: string | null | undefined) {
	const [totalRow] = await db
		.select({ n: count() })
		.from(postLikes)
		.where(eq(postLikes.postId, postId));

	const total = Number(totalRow?.n ?? 0);

	let viewerHasLiked = false;
	if (viewerUserId) {
		const like = await db.query.postLikes.findFirst({
			where: and(eq(postLikes.postId, postId), eq(postLikes.userId, viewerUserId)),
			columns: { postId: true }
		});
		viewerHasLiked = !!like;
	}

	return { total, viewerHasLiked };
}

export async function setLike(
	postId: string,
	userId: string,
	liked: boolean
): Promise<{ ok: true; total: number; viewerHasLiked: boolean } | { ok: false; error: string }> {
	const ok = await assertPublishedPost(postId);
	if (!ok) return { ok: false, error: 'Post not found' };

	if (liked) {
		await db.insert(postLikes).values({ postId, userId }).onConflictDoNothing();
	} else {
		await db
			.delete(postLikes)
			.where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
	}

	const summary = await getLikeSummary(postId, userId);
	return { ok: true, total: summary.total, viewerHasLiked: summary.viewerHasLiked };
}

export async function getFollowSummary(
	authorUserId: string,
	viewerUserId: string | null | undefined
) {
	const [totalRow] = await db
		.select({ n: count() })
		.from(authorFollows)
		.where(eq(authorFollows.followingId, authorUserId));

	const total = Number(totalRow?.n ?? 0);

	let viewerFollows = false;
	if (viewerUserId && viewerUserId !== authorUserId) {
		const row = await db.query.authorFollows.findFirst({
			where: and(
				eq(authorFollows.followerId, viewerUserId),
				eq(authorFollows.followingId, authorUserId)
			),
			columns: { followerId: true }
		});
		viewerFollows = !!row;
	}

	return { total, viewerFollows };
}

export async function setFollow(
	followerId: string,
	followingId: string,
	following: boolean
): Promise<
	{ ok: true; total: number; viewerFollows: boolean } | { ok: false; error: string }
> {
	if (followerId === followingId) {
		return { ok: false, error: 'Cannot follow yourself' };
	}

	const target = await db.query.user.findFirst({
		where: eq(user.id, followingId),
		columns: { id: true }
	});
	if (!target) return { ok: false, error: 'User not found' };

	if (following) {
		await db.insert(authorFollows).values({ followerId, followingId }).onConflictDoNothing();
	} else {
		await db
			.delete(authorFollows)
			.where(
				and(eq(authorFollows.followerId, followerId), eq(authorFollows.followingId, followingId))
			);
	}

	const summary = await getFollowSummary(followingId, followerId);
	return { ok: true, total: summary.total, viewerFollows: summary.viewerFollows };
}
