import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { DataSource, type Repository } from "typeorm";

import { RoleApproval } from "src/modules/database/entities/role-management.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { USER_ROLES } from "src/user/user-types";

import { RoleManagementService } from "./role-management.service";

import type { TokenPayload } from "src/auth/auth-types";

describe("Role management service suit", () => {
  let roleManagementService: RoleManagementService;
  let roleManagementRepository: jest.Mocked<Repository<RoleApproval>>;
  let userRepository: jest.Mocked<Repository<UserEntity>>;

  const mockDataSource = {
    transaction: jest.fn(async (cb) => cb({})),
    createQueryRunner: jest.fn(),
  };
  const mockUserEntity: TokenPayload = {
    id: "uuid-123",
    email: "test@test.com",
    role: USER_ROLES.ADMIN,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    roleManagementRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      exists: jest.fn(),
    } as any;

    userRepository = {
      findOne: jest.fn(),
      exists: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleManagementService,
        {
          provide: getRepositoryToken(RoleApproval),
          useValue: roleManagementRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    roleManagementService = module.get(RoleManagementService);
  });

  describe("create()", () => {
    it("creates a role upgrade request", async () => {
      userRepository.exists.mockResolvedValue(true);
      const result = {
        requestedRole: USER_ROLES.ADMIN,
        userId: mockUserEntity.id,
      };
      await roleManagementService.requestUpgrade(USER_ROLES.ADMIN, {
        ...mockUserEntity,
        role: USER_ROLES.READER,
      });
      expect(roleManagementRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(result),
      );
    });
    it("throws Forbidden exception if user is requesting upgrade for the role it currently has.", async () => {
      userRepository.exists.mockResolvedValue(true); // user exists

      await expect(
        roleManagementService.requestUpgrade(USER_ROLES.READER, {
          ...mockUserEntity,
          role: USER_ROLES.READER,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws NotFoundException if user does not exist", async () => {
      userRepository.exists.mockResolvedValue(false);
      await expect(
        roleManagementService.requestUpgrade(USER_ROLES.ADMIN, mockUserEntity),
      ).rejects.toThrow(NotFoundException);
    });

    it("throws ConflictException if user already has a pending request", async () => {
      userRepository.exists.mockResolvedValue(true); // user exists
      roleManagementRepository.exists.mockReturnValue(true); //   request exists
      await expect(
        roleManagementService.requestUpgrade(USER_ROLES.ADMIN, {
          ...mockUserEntity,
          role: USER_ROLES.READER,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
