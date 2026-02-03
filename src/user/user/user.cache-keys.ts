// users.cache-keys.ts (functions only)

export const userListCacheKey = (params: {
  page: number;
  limit: number;
  isPagination: boolean;
}) => {
  const page = Number(params.page);
  const limit = Number(params.limit);
  const pagination = Boolean(params.isPagination);

  return `users:v1:page=${page}:limit=${limit}:pagination=${pagination}`;
};

export const userByIdCacheKey = (id: string) => {
  return `user:v1:id=${id}`;
};
