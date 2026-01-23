export enum USER_ROLES {
  ADMIN = 'admin',
  AUTHOR = 'author',
  READER = 'reader',
}

export interface updateUserParams {
  userName?: string;
  firstName?: string;
  lastName?: string;
}
