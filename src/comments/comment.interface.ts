export interface CreateCommentInput {
  content: string;
  authorId: string;
  postId: string;
}

export interface UpdateCommentInput {
  isApproved?: boolean;
  content: string;
}
