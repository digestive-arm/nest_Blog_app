import type { Cache } from "@nestjs/cache-manager";

export function categoryListCacheKey(params: {
  page: number;
  limit: number;
  isPagination: boolean;
}): string {
  const { page, limit, isPagination } = params;

  return `categories:page=${page}:limit=${limit}:pagination=${isPagination}`;
}

export function categoryCacheKeyById(categoryId: string): string {
  return `category:${categoryId}`;
}

export async function invalidateCategoryCacheKeyById(
  cacheManager: Cache,
  categoryId: string,
): Promise<void> {
  const key = categoryCacheKeyById(categoryId);
  await cacheManager.del(key);
}
