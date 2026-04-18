import { relations, sql } from 'drizzle-orm';
import {
	index,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	boolean,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';
import type { PostOptions } from '$lib/types/post-options';
import { user } from './auth.schema';

/** Legacy block shape (matches Convex posts.blocks) */
export type PostBlockRow = {
	id: string;
	type: string;
	content: Record<string, unknown>;
	order: number;
};

export const posts = pgTable(
	'posts',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		authorId: text('author_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		slug: text('slug').notNull(),
		excerpt: text('excerpt'),
		coverImage: text('cover_image'),
		options: jsonb('options')
			.$type<PostOptions>()
			.notNull()
			.default(sql`'{}'::jsonb`),
		published: boolean('published').notNull().default(false),
		blocks: jsonb('blocks')
			.$type<PostBlockRow[]>()
			.notNull()
			.default(sql`'[]'::jsonb`),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'date' })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	(t) => [
		index('posts_author_idx').on(t.authorId),
		index('posts_slug_idx').on(t.slug),
		index('posts_published_idx').on(t.published),
		uniqueIndex('posts_author_slug_unique').on(t.authorId, t.slug)
	]
);

export const siteSettings = pgTable('site_settings', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	webName: text('web_name').notNull(),
	hero: jsonb('hero').notNull().$type<{
		title: string;
		description: string;
		/** Wide banner; preferred over legacy `imageUrl`. */
		coverImageUrl?: string;
		/** Circular avatar on the home hero. */
		profileImageUrl?: string;
		/** @deprecated Use `coverImageUrl`; still read as fallback when cover is empty. */
		imageUrl?: string;
		ctaLabel?: string;
		ctaHref?: string;
	}>(),
	background: text('background').notNull(),
	fontFamily: text('font_family').notNull(),
	colorScheme: jsonb('color_scheme').notNull().$type<{ primary: string; secondary: string }>()
});

export const siteSettingsRelations = relations(siteSettings, ({ one }) => ({
	owner: one(user, {
		fields: [siteSettings.userId],
		references: [user.id]
	})
}));

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(user, {
		fields: [posts.authorId],
		references: [user.id]
	})
}));

export const postComments = pgTable(
	'post_comments',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		postId: uuid('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		body: text('body').notNull(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
	},
	(t) => [index('post_comments_post_idx').on(t.postId)]
);

export const postLikes = pgTable(
	'post_likes',
	{
		postId: uuid('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
	},
	(t) => [
		uniqueIndex('post_likes_post_user_unique').on(t.postId, t.userId),
		index('post_likes_post_idx').on(t.postId)
	]
);

export const authorFollows = pgTable(
	'author_follows',
	{
		followerId: text('follower_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		followingId: text('following_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
	},
	(t) => [
		uniqueIndex('author_follows_follower_following_unique').on(t.followerId, t.followingId),
		index('author_follows_following_idx').on(t.followingId),
		index('author_follows_follower_idx').on(t.followerId)
	]
);

export const postCommentsRelations = relations(postComments, ({ one }) => ({
	post: one(posts, {
		fields: [postComments.postId],
		references: [posts.id]
	}),
	author: one(user, {
		fields: [postComments.userId],
		references: [user.id]
	})
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
	post: one(posts, {
		fields: [postLikes.postId],
		references: [posts.id]
	}),
	user: one(user, {
		fields: [postLikes.userId],
		references: [user.id]
	})
}));

export const authorFollowsRelations = relations(authorFollows, ({ one }) => ({
	follower: one(user, {
		fields: [authorFollows.followerId],
		references: [user.id],
		relationName: 'follower'
	}),
	following: one(user, {
		fields: [authorFollows.followingId],
		references: [user.id],
		relationName: 'following'
	})
}));

export * from './auth.schema';
