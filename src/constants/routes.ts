export const AUTH_ROUTES = {
  AUTH: 'auth',
  LOGIN: 'login',
  REGISTER: 'register',
  REFRESH: 'refresh',
  LOGOUT: 'logout',
};

export const ROLE_MANAGEMENT_ROUTES = {
  ROLE: 'role',
  MY_REQUESTS: ':id/my-requests',
  UPGRADE_ROLE: ':id/upgrade',
  PENDING_REQUESTS: 'pending-requests',
  PROCESS_REQUEST: '/:id/process-request',
};

export const USER_ROUTES = {
  USER: 'user',
  FIND_ONE: ':id',
  UPDATE: ':id',
  DELETE: ':id',
};

export const BLOG_POST_ROUTES = {
  BLOG_POST: 'blogpost',
  CREATE: '',
  GET_ALL: '',
  UPDATE: ':id',
  DELETE: ':id',
  PUBLISH: ':id/publish',
  GET_COMMENTS_ON_POST: ':id/comments',
  APPROVE_COMMENT: ':id/comments/:commentId/proces-comment',
};

export const SEARCH_ROUTES = {
  SEARCH: 'search',
};
export const CATEGORY_ROUTES = {
  CATEGORY: 'category',
  CREATE: '',
  GET_ALL: '',
  GET_ONE: ':id',
  UPDATE: ':id',
  DELETE: ':id',
};

export const UPLOAD_ROUTES = {
  UPLOAD: 'uploads',
  CREATE_UPLOAD: '',
  DELETE_UPLOAD: ':folder/:id',
};

export const COMMENT_ROUTES = {
  COMMENT: 'comments',
  CREATE: '',
  GET_ONE: ':id',
  GET_ALL: '',
  UPDATE: ':id',
  DELETE: ':id',
};
