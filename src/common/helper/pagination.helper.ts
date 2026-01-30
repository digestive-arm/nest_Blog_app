import type {
  PaginationMeta,
  PaginationParams,
} from "../interfaces/pagination.interfaces";

export function getPaginationMeta<T>(
  paginationParams: PaginationParams<T>,
): PaginationMeta<T> {
  const { items, total, page, limit } = paginationParams;
  return {
    data: items,
    meta: {
      totalItems: total,
      itemsCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
