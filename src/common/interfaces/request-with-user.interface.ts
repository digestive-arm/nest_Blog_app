import { Request } from 'express';
import { TokenPayload } from 'src/auth/auth-types';

export interface RequestWithUser extends Request {
  user: TokenPayload;
}
