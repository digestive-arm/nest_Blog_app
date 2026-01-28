import {
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UserEntity } from "src/modules/database/entities/user.entity";
import { USER_ROLES } from "src/user/user-types";
import { AuthUtils } from "src/utils/auth.utils";

import { AuthService } from "./auth.service";

import type { Repository } from "typeorm";

describe("AuthService - Edge Case Logic", () => {
  let service: AuthService;
  let userRepository: Repository<UserEntity>;
  let authUtils = jest.mocked(AuthUtils);

  const mockUserEntity = {
    id: "uuid-123",
    email: "test@test.com",
    refreshToken: "valid-token",
  };

  const createQB = () => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  });

  const mockUserRepository = {
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
  };

  const mockAuthUtils = {
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    decodeToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        { provide: AuthUtils, useValue: mockAuthUtils },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    authUtils = module.get(AuthUtils);
  });

  describe("refresh()", () => {
    it("throws ForbiddenException when refresh tokens are not synced", async () => {
      const qb = createQB();
      mockUserRepository.createQueryBuilder.mockReturnValue(qb);

      qb.getOne.mockResolvedValue({
        ...mockUserEntity,
        refreshToken: "token-A",
      });

      authUtils.decodeToken.mockReturnValue({ id: mockUserEntity.id });

      await expect(service.refresh("token-B")).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("sanitizes payload by removing iat and exp before re-signing", async () => {
      const qb = createQB();
      mockUserRepository.createQueryBuilder.mockReturnValue(qb);

      qb.getOne.mockResolvedValue(mockUserEntity);

      authUtils.decodeToken.mockReturnValue({
        id: "1",
        role: USER_ROLES.ADMIN,
        iat: 123,
        exp: 456,
      });

      await service.refresh("valid-token");

      expect(authUtils.generateAccessToken).toHaveBeenCalledWith({
        id: "1",
        role: "admin",
      });
      expect(authUtils.generateRefreshToken).toHaveBeenCalledWith({
        id: "1",
        role: "admin",
      });
    });

    it("throws NotFoundException if user does not exist", async () => {
      const qb = createQB();
      mockUserRepository.createQueryBuilder.mockReturnValue(qb);

      qb.getOne.mockResolvedValue(null);
      authUtils.decodeToken.mockReturnValue({ id: "missing" });

      await expect(service.refresh("token")).rejects.toThrow(NotFoundException);
    });
  });

  describe("login()", () => {
    it("explicitly selects password using addSelect", async () => {
      const qb = createQB();
      mockUserRepository.createQueryBuilder.mockReturnValue(qb);

      qb.getOne.mockResolvedValue(null);

      await expect(
        service.login({ email: "a@a.com", password: "p" }),
      ).rejects.toThrow();

      expect(qb.addSelect).toHaveBeenCalledWith("user.password");
    });

    it("throws UnauthorizedException when password validation fails", async () => {
      const qb = createQB();
      mockUserRepository.createQueryBuilder.mockReturnValue(qb);

      qb.getOne.mockResolvedValue({
        id: "1",
        password: "hashed",
      });

      authUtils.validatePassword.mockResolvedValue(false);

      await expect(
        service.login({ email: "a@a.com", password: "wrong" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("register()", () => {
    it("checks both email and username for duplicates", async () => {
      const qb = createQB();
      mockUserRepository.createQueryBuilder.mockReturnValue(qb);

      qb.getOne.mockResolvedValue(null);

      await service.register({
        email: "new@t.com",
        userName: "unique",
        password: "p",
        firstName: "f",
        lastName: "l",
      });

      expect(qb.where).toHaveBeenCalledWith("user.email = :email", {
        email: "new@t.com",
      });
      expect(qb.orWhere).toHaveBeenCalledWith("user.userName = :userName", {
        userName: "unique",
      });
    });
  });

  describe("logout()", () => {
    it("nullifies refresh token and persists user", async function (this: void) {
      const qb = createQB();
      mockUserRepository.createQueryBuilder.mockReturnValue(qb);

      const user = {
        id: "uuid-123",
        email: "test@test.com",
        refreshToken: "valid-token",
      };

      qb.getOne.mockResolvedValue(user);

      await service.logout(user.id);

      expect(user.refreshToken).toBeNull();
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
