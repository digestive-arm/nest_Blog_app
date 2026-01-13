export interface paginationMeta {
  data: any[];
  meta: {
    totalItems: number;
    itemsCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface paginationParams {
  items: any[];
  page: number;
  limit: number;
  total: number;
}
export interface paginationInput {
  page: number;
  limit: number;
  isPagination: boolean;
}
