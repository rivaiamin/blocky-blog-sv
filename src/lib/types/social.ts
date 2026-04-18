export type CommentWithAuthor = {
	id: string;
	body: string;
	createdAt: Date;
	author: {
		id: string;
		name: string;
		username: string | null;
		image: string | null;
	};
};
