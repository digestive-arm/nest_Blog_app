import type { Request } from "express";
import type { TokenPayload } from "src/auth/auth-types";

export interface RequestWithUser extends Request {
  user: TokenPayload;
}
