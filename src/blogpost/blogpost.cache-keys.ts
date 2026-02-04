import type { Cache } from "@nestjs/cache-manager";

export function blogPostListCacheKey(params: {
  page: number;
  limit: number;
  isPagination: boolean;
  q?: string;
}): string {
  const { page, limit, isPagination, q } = params;

  return `posts:page=${page}:limit=${limit}:pagination=${isPagination}:q=${q ?? "NotSpecified"}`;
}

export function blogPostCommentsCacheKey(params: {
  postId: string;
  page: number;
  limit: number;
  isPagination: boolean;
}): string {
  const { postId, page, limit, isPagination } = params;

  return `post:${postId}:comments:page=${page}:limit=${limit}:pagination=${isPagination}`;
}

export function blogPostBySlugCacheKey(slug: string): string {
  return `post:${slug}`;
}
export async function invalidateBlogPostBySlug(
  cacheManager: Cache,
  slug: string,
): Promise<void> {
  const key = blogPostBySlugCacheKey(slug);
  await cacheManager.del(key);
}
