export interface PaginationMeta<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemsCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface PaginationParams<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}
export interface PaginationInput {
  page: number;
  limit: number;
  isPagination: boolean;
}
