export const GET_ALL_BLOG_POST_SELECT = [
  'attachment.url',
  'post.id',
  'post.title',
  'post.content',
  'post.summary',
  'post.authorId',
  'post.categoryId',
  'post.slug',
  'post.createdAt',
  'post.status',
];

export const OWNERSHIP_GUARD_BLOG_POST_SELECT = ['post.authorId', 'post.id'];
export const GET_COMMENTS_ON_POST_SELECT = [
  'comment.id',
  'comment.content',
  'comment.createdAt',
  'author.id',
  'author.userName',
];
export const SEARCH_QUERY = `(post.title ILIKE :q OR post.content ILIKE :q)`;

export const SOFT_DELETED_POSTS_CLEANUP_INTERVAL = 30;
