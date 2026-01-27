export const AUTH_ROUTES = {
  AUTH: "auth",
  ME: "me",
  LOGIN: "login",
  REGISTER: "register",
  REFRESH: "refresh",
  LOGOUT: "logout",
};

export const ROLE_MANAGEMENT_ROUTES = {
  ROLE: "role-requests",
  MY_REQUESTS: "my-requests",
  UPGRADE_ROLE: "",
  PENDING_REQUESTS: "pending-requests",
  PROCESS_REQUEST: ":id",
};

export const USER_ROUTES = {
  USER: "users",
  FIND_ONE: ":id",
  UPDATE: ":id",
  DELETE: ":id",
};

export const BLOG_POST_ROUTES = {
  BLOG_POST: "posts",
  CREATE: "",
  GET_ALL: "",
  GET_ONE: ":slug",
  UPDATE: ":id",
  DELETE: ":id",
  PUBLISH: ":id/status",
  CREATE_COMMENT: ":id/comments",
  GET_COMMENTS_ON_POST: ":id/comments",
};

export const SEARCH_ROUTES = {
  SEARCH: "search",
};
export const CATEGORY_ROUTES = {
  CATEGORY: "categories",
  CREATE: "",
  GET_ALL: "",
  GET_ONE: ":id",
  UPDATE: ":id",
  DELETE: ":id",
};

export const UPLOAD_ROUTES = {
  UPLOAD: "uploads",
  CREATE_UPLOAD: "",
  DELETE_UPLOAD: ":folder/:id",
};

export const COMMENT_ROUTES = {
  COMMENT: "comments",
  CREATE: "",
  GET_ONE: ":id",
  GET_ALL: "",
  UPDATE: ":id",
  DELETE: ":id",
};
