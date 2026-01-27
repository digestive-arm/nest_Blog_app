import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { AuthUtils } from "src/utils/auth.utils";

interface Authcookies {
  accessToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authUtils: AuthUtils) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest<RequestWithUser>();

      const cookies = request.cookies as Authcookies;
      const { accessToken } = cookies;

      if (!accessToken) {
        throw new UnauthorizedException("Session expired please login again");
      }

      const decoded = this.authUtils.decodeToken(accessToken);

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
