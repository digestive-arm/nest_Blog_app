import { BLOG_POST_STATUS } from "src/blogpost/blogpost-types";
import { COMMENT_STATUS } from "src/comments/comments-types";

export const AUTHOR_DASHBOARD_CONSTANTS = {
  AUTHOR_POST_STATS: [
    "COUNT(*) as totalPosts",
    `SUM(CASE WHEN post.status = '${BLOG_POST_STATUS.PUBLISHED}' THEN 1 ELSE 0 END) as publishedPosts `,
    `SUM(CASE WHEN post.status = '${BLOG_POST_STATUS.DRAFT}' THEN 1 ELSE 0 END)  as draftPosts`,
  ],
  AUTHOR_COMMENT_STATS_SELECT: [
    "COUNT(*) as totalComments",
    `SUM(CASE WHEN comment.status = '${COMMENT_STATUS.PENDING}' THEN 1 ELSE 0 END) as pendingComments`,
  ],
  AUTHOR_DASHBOARD_RECENT_COMMENT_SELECT: [
    "comment.id",
    "comment.createdAt",
    "comment.content",
    "comment.status",
    "post.id",
    "post.title",
  ],
  AUTHOR_DASHBOARD_RECENT_POST_SELECT: [
    "post.id",
    "post.createdAt",
    "post.title",
    "post.content",
    "post.slug",
    "cat.id",
    "cat.name",
  ],
  AUTHOR_DASHBOARD_RECENT_COMMENT_SELECT_LIMIT: 1,
  AUTHOR_DASHBOARD_RECENT_POST_SELECT_LIMIT: 1,
};
