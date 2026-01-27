import { Module } from "@nestjs/common";

import { UserModule } from "src/user/user.module";
import { AuthUtils } from "src/utils/auth.utils";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthUtils],
})
export class AuthModule {}
