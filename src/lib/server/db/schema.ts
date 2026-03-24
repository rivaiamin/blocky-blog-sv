import { relations, sql } from 'drizzle-orm';
import {
	index,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	boolean,
	uuid
} from 'drizzle-orm/pg-core';
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
		slug: text('slug').notNull().unique(),
		excerpt: text('excerpt'),
		coverImage: text('cover_image'),
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
		index('posts_published_idx').on(t.published)
	]
);

export const siteSettings = pgTable('site_settings', {
	id: serial('id').primaryKey(),
	settingKey: text('setting_key').notNull().unique(),
	webName: text('web_name').notNull(),
	hero: jsonb('hero').notNull().$type<{
		title: string;
		description: string;
		imageUrl?: string;
		ctaLabel?: string;
		ctaHref?: string;
	}>(),
	background: text('background').notNull(),
	fontFamily: text('font_family').notNull(),
	colorScheme: jsonb('color_scheme')
		.notNull()
		.$type<{ primary: string; secondary: string }>()
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(user, {
		fields: [posts.authorId],
		references: [user.id]
	})
}));

export * from './auth.schema';
