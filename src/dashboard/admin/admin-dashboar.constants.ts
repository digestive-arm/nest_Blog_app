import { BLOG_POST_STATUS } from "src/blogpost/blogpost-types";
import { COMMENT_STATUS } from "src/comments/comments-types";
import { USER_ROLES } from "src/user/user-types";

export const AUTHOR_DASHBOARD_CONSTANTS = {
  USER_STATS_SELECT: [
    "COUNT(*) as totalUsers",
    `SUM(CASE WHEN user.role = '${USER_ROLES.AUTHOR}' THEN 1 ELSE 0 END) as totalAuthors`,
  ],
  POST_STATS_SELECT: [
    `SUM(CASE WHEN post.status = '${BLOG_POST_STATUS.PUBLISHED}' THEN 1 ELSE 0 END) as totalPosts`,
    `SUM(CASE WHEN post.status = '${BLOG_POST_STATUS.DRAFT}' THEN 1 ELSE 0 END) as pendingPosts`,
  ],
  COMMENT_STATS_SELECT: [
    `SUM(CASE WHEN comment.status = '${COMMENT_STATUS.APPROVED}' THEN 1 ELSE 0 END) as totalComments`,
    `SUM(CASE WHEN comment.status = '${COMMENT_STATUS.PENDING}' THEN 1 ELSE 0 END) as pendingComments`,
  ],
  RECENT_COMMENT_SELECT: [
    "comment.createdAt",
    "comment.content",
    "comment.status",
    "comment.id",
    "post.id",
    "post.title",
  ],
  RECENT_POST_SELECT: [
    "post.id",
    "post.createdAt",
    "post.title",
    "post.content",
    "post.slug",
    "cat.id",
    "cat.name",
  ],
  RECENT_COMMENT_SELECT_LIMIT: 1,
  RECENT_POST_SELECT_LIMIT: 1,
  POST_BY_CATEGORY_SELECT: [
    "cat.id ",
    "COALESCE(cat.name, 'Uncategorized')",
    "COUNT(post.id)",
  ],
  POST_BY_CATEGORY_SELECTION_ALIAS: ["categoryId", "categoryName", "postCount"],
  BLOG_POST_CATEGORY_STATS_SELECT: [
    { selection: "cat.id", alias: "categoryId" },
    { selection: "COALESCE(cat.name, 'Uncategorized')", alias: "categoryName" },
    { selection: "COUNT(post.id)", alias: "postCount" },
  ],
  BLOG_POST_CATEGORY_STATS_GROUP_BY: [
    "cat.id",
    "COALESCE(cat.name, 'Uncategorized')",
  ],
};
