import type { Cache } from "@nestjs/cache-manager";

export function userRoleRequestsCacheKey(userId: string): string {
  return `roleRequest:user:${userId}`;
}
export function pendingRoleRequestCacheKey(params: {
  page: number;
  limit: number;
  isPagination: boolean;
}): string {
  return `roleRequest:${params.page}:${params.limit}:${params.isPagination}`;
}

export async function invalidateRoleRequestCacheKey(
  cacheManager: Cache,
  userId: string,
): Promise<void> {
  const key = userRoleRequestsCacheKey(userId);
  await cacheManager.del(key);
}
