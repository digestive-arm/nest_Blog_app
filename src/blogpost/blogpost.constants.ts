export const BLOG_POST_CONSTANTS = {
  GET_ALL_BLOG_POST_SELECT: [
    "attachment.url",
    "post.id",
    "post.title",
    "post.content",
    "post.summary",
    "post.authorId",
    "post.categoryId",
    "post.slug",
    "post.createdAt",
    "post.status",
  ],
  GET_COMMENTS_ON_POST_SELECT: [
    "comment.id",
    "comment.content",
    "comment.createdAt",
    "comment.status",
    "author.id",
    "author.userName",
  ],
  SEARCH_QUERY: `(post.title ILIKE :q OR post.content ILIKE :q)`,
  SOFT_DELETED_POSTS_CLEANUP_INTERVAL: 30,
};
