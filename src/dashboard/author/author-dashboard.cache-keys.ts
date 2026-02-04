export function authorDashboardCacheKey(authorId: string): string {
  return `author:${authorId}:dashboard`;
}

export function authorDashboardStatsCacheKey(authorId: string): string {
  return `author:${authorId}:dashboard:stats`;
}

export function authorDashboardRecentPostCacheKey(authorId: string): string {
  return `author:${authorId}:dashboard:post:recent`;
}

export function authorDashboardRecentCommentCacheKey(authorId: string): string {
  return `author:${authorId}:dashboard:comment:recent`;
}
