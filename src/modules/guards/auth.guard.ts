import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { decodeToken } from "src/utils/auth.utils";

interface AuthCookies {
  accessToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest<RequestWithUser>();

      const cookies = request.cookies as AuthCookies;
      const { accessToken } = cookies;

      if (!accessToken) {
        throw new UnauthorizedException("Session expired please login again");
      }

      const decoded = decodeToken(accessToken);

      delete decoded["iat"];
      delete decoded["exp"];
      request.user = decoded;
      return true;
    } catch (error) {
      throw new ForbiddenException(
        error,
        "session expired please login to continue",
      );
    }
  }
}
