import type { paginationInput } from "src/common/interfaces/pagination.interfaces";

export interface CreateBlogPostInput {
  title: string;
  content: string;
  summary?: string;
  categoryId?: string;
  authorId: string;
}

export interface UpdateBlogPostInput {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: string;
}

export interface GetCommentsOnPostInput extends paginationInput {
  isPending?: boolean;
}
