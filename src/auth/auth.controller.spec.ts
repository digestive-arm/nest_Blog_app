import {
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { type Request } from "express";

import { ERROR_MESSAGES } from "src/constants/messages.constants";
import { USER_ROLES } from "src/user/user-types";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthUtils } from "src/utils/auth.utils";

describe("AuthController - Full Edge Case Suite", () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  // Mock Response object with chainable methods
  const res: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  const mockAuthUtils = {
    validateToken: jest.fn(),
    extractToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: AuthUtils,
          useValue: mockAuthUtils,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register() Edge Cases", () => {
    it("should return error response if user already exists (Conflict)", async function (this: void) {
      authService.register.mockRejectedValue(
        new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS_ACCOUNT),
      );

      await controller.register(res, {
        email: "dup@t.com",
        password: "p",
        userName: "u",
        firstName: "f",
        lastName: "l",
      });

      expect(res.status).toHaveBeenCalledWith(409);
      // Adjusted to match received structure: { message, statusCode }
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.ALREADY_EXISTS_ACCOUNT,
          statusCode: 409,
        }),
      );
    });
  });

  describe("login() Edge Cases", () => {
    it("should return error response if credentials are wrong (NotFound/Unauthorized)", async function (this: void) {
      authService.login.mockRejectedValue(
        new NotFoundException(ERROR_MESSAGES.NOT_FOUND),
      );

      await controller.login(res, { email: "wrong@t.com", password: "p" });

      expect(res.status).toHaveBeenCalledWith(404);
      // Adjusted to match received structure: { message, statusCode }
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.NOT_FOUND,
          statusCode: 404,
        }),
      );
    });
  });

  describe("refresh() Edge Cases", () => {
    it("should throw UnauthorizedException if refreshToken cookie is missing entirely", async function (this: void) {
      const req = { cookies: {} } as Request;

      await expect(controller.refresh(res, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException if refreshToken cookie is not a string", async function (this: void) {
      const req = { cookies: { refreshToken: 12345 } } as unknown as Request;

      await expect(controller.refresh(res, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should handle ForbiddenException if refresh token is not synced in DB", async function (this: void) {
      const req = {
        cookies: { refreshToken: "stolen-token" },
      } as unknown as Request;

      authService.refresh.mockRejectedValue(
        new ForbiddenException(ERROR_MESSAGES.FORBIDDEN),
      );

      await controller.refresh(res, req);

      expect(res.status).toHaveBeenCalledWith(403);
      // Adjusted to match received structure: { message, statusCode }
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.FORBIDDEN,
          statusCode: 403,
        }),
      );
    });
  });

  describe("logout() Edge Cases", () => {
    it("should clear cookies even if the service.logout fails (Security Best Practice)", async function (this: void) {
      const mockUser = { id: "u1", role: USER_ROLES.READER, email: "t@t.com" };

      // Testing that the controller handles a service rejection gracefully
      authService.logout.mockRejectedValue(new Error("DB Down"));

      await controller.logout(res, mockUser);

      expect(res.clearCookie).toHaveBeenCalledWith("accessToken");
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
    });
  });
});
