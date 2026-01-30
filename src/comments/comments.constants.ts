export const COMMENT_CONSTANTS = {
  GET_ALL_COMMENTS_SELECT: [
    "comment.id",
    "comment.authorId",
    "comment.postId",
    "comment.content",
  ],
  GET_ONE_COMMENT_SELECT: [
    "comment.id",
    "comment.authorId",
    "comment.postId",
    "comment.content",
    "comment.createdAt",
  ],
};
