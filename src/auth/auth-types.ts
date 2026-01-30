import type { USER_ROLES } from "src/user/user-types";

export interface CreateUserParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface LoginUserParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: USER_ROLES;
}
