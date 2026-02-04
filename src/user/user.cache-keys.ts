// users.cache-keys.ts (functions only)

import type { Cache } from "@nestjs/cache-manager";

export function userListCacheKey(params: {
  page: number;
  limit: number;
  isPagination: boolean;
}): string {
  const page = Number(params.page);
  const limit = Number(params.limit);
  const pagination = Boolean(params.isPagination);

  return `users:v1:page=${page}:limit=${limit}:pagination=${pagination}`;
}

export function userByIdCacheKey(id: string): string {
  return `user:v1:id=${id}`;
}

export async function invalidateUserCacheKeyById(
  cacheManager: Cache,
  userId: string,
): Promise<void> {
  const key = userByIdCacheKey(userId);
  await cacheManager.del(key);
}
