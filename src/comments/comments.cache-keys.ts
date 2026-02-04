import type { Cache } from "@nestjs/cache-manager";

export function commentCacheKeyById(commentId: string): string {
  return `comment:${commentId}`;
}

export async function invalidateCommentCacheKeyById(
  cacheManager: Cache,
  commentId: string,
): Promise<void> {
  await cacheManager.del(`comment:${commentId}`);
}
