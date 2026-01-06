import { userRoles } from 'src/user/user.types';

export interface createUserParams {
  email: string;
  password: string;
}

export interface loginUserParams {
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
  role: userRoles;
}
