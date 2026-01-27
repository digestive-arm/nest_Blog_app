import type {
  paginationMeta,
  paginationParams,
} from "../interfaces/pagination.interfaces";

export function getPageinationMeta(
  paginationParams: paginationParams,
): paginationMeta {
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

export function getOffset(page: number, limit: number) {
  return (page - 1) * limit;
}
