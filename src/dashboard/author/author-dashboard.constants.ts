export const RECENT_AUTHOR_POST_SELECT = [
  "post.id",
  "post.createdAt",
  "post.title",
  "post.content",
  "post.slug",
  "cat.id",
  "cat.name",
];
export const RECENT_AUTHOR_COMMENT_SELECT = [
  "comment.id",
  "comment.createdAt",
  "comment.content",
  "comment.status",
  "post.id",
  "post.title",
];
export const RECENT_AUTHOR_COMMENT_LIMIT = 1;
export const RECENT_AUTHOR_POST_LIMIT = 1;
