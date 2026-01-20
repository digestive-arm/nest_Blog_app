export interface CreateBlogPostInput {
  title: string;
  content: string;
  summary?: string;
  authorId: string;
  categoryId?: string;
}

export interface UpdateBlogPostInput {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: string;
}
