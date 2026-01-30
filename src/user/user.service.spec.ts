import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UserEntity } from "src/modules/database/entities/user.entity";

import { USER_ROLES } from "./user-types";
import { UserService } from "./user.service";

import type { Repository } from "typeorm";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;

  const mockUserEntity: UserEntity = {
    id: "uuid-123",
    userName: "testUser",
    firstName: "Test",
    lastName: "User",
    email: "testuser@test.com",
    password: "hashed-password",
    isActive: true,
    role: USER_ROLES.READER,
    refreshToken: null,

    roleRequest: [],
    blogPosts: [],
    comment: [],

    createdAt: new Date(),
    updatedAt: new Date(),
  } as UserEntity;

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      preload: jest.fn(),
      save: jest.fn(() => {}),
      findOne: jest.fn(),
      exists: jest.fn(),
      softRemove: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
      ],
    }).compile();
    userService = module.get(UserService);
  });

  describe("findAll()", () => {
    it("returns paginated response containing all users", async () => {
      const page = 1;
      const limit = 10;
      userRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserEntity], 1]),
      } as any);

      const result = await userService.findAll({
        page,
        limit,
        isPagination: true,
      });
      expect(result.data).toEqual([mockUserEntity]);
      expect(result.meta.totalItems).toEqual(1);
      expect(result.meta.itemsPerPage).toBe(limit);
    });

    it("returns non-paginated response containing all users", async () => {
      const page = 1;
      const limit = 10;
      const skip = jest.fn().mockReturnThis();
      const take = jest.fn().mockReturnThis();

      userRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip,
        take,
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserEntity], 1]),
      } as any);
      await userService.findAll({
        page,
        limit,
        isPagination: false,
      });

      expect(skip).not.toHaveBeenCalled();
      expect(take).not.toHaveBeenCalled();
    });
  });

  describe("findOne()", () => {
    it("throws NotFoundException if user does not exist", async () => {
      userRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null), // simulate user doesn't exist
      } as any);
      await expect(userService.findOne(mockUserEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("returns user based on provided userId", async () => {
      const where = jest.fn().mockReturnThis();

      userRepository.createQueryBuilder.mockReturnValue({
        where,
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUserEntity), // simulate mock user as found user
      } as any);

      const result = await userService.findOne(mockUserEntity.id);

      expect(where).toHaveBeenCalledWith("user.id = :id", {
        id: mockUserEntity.id,
      });
      expect(result).toEqual(mockUserEntity);
    });
  });

  describe("updateUser()", () => {
    it("throws ForbiddenException if non-admin user tries to update details of other user", async () => {
      await expect(
        userService.update(mockUserEntity.id, "uuid2", {
          firstName: "randomUser",
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws ConflictException if new userName is already taken", async () => {
      userRepository.exists.mockResolvedValue(true);
      await expect(
        userService.update(mockUserEntity.id, mockUserEntity.id, {
          userName: "i_am_taken",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("throws NotFoundException if user does not exist", async () => {
      userRepository.exists.mockResolvedValue(false);
      userRepository.preload.mockResolvedValue(undefined);
      await expect(
        userService.update(mockUserEntity.id, mockUserEntity.id, {
          firstName: "new_name",
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it("lets user update its details", async () => {
      userRepository.exists.mockResolvedValue(false);

      userRepository.preload.mockResolvedValue({
        ...mockUserEntity,
        firstName: "new_name",
      });
      await userService.update(mockUserEntity.id, mockUserEntity.id, {
        firstName: "new_name",
      });
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe("deleteUser()", () => {
    it("throws NotFoundException if user does not exist", async () => {
      userRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(userService.remove(mockUserEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("soft deletes user", async () => {
      userRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUserEntity),
      } as any);
      await userService.remove(mockUserEntity.id);
      expect(userRepository.softRemove).toHaveBeenCalled();
    });
  });
});
