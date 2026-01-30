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
    transaction: jest.fn(),
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
  describe("getMyRequest()", () => {
    it("throws NotFoundException if user does not exist", async () => {
      userRepository.exists.mockResolvedValue(false);
      await expect(
        roleManagementService.getMyRequests(mockUserEntity.id),
      ).rejects.toThrow(NotFoundException);
    });
    it("returns role requests", async () => {
      userRepository.exists.mockResolvedValue(true); // user exists
      const mockRequests = [{ id: mockUserEntity.id }];
      roleManagementRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRequests),
      })) as any;
      const result = await roleManagementService.getMyRequests(
        mockUserEntity.id,
      );
      expect(result).toEqual(mockRequests);
    });
  });

  describe("getPendingRequests()", () => {
    it("returns requests with pagination", async () => {
      const mockPendingRequests = [[{ id: 1 }, { id: 2 }], 2];
      const qb = {
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue(mockPendingRequests),
      };

      roleManagementRepository.createQueryBuilder = jest.fn(() => qb) as any;

      const result = await roleManagementService.getPendingRequest({
        page: 1,
        limit: 1,
        isPagination: true,
      });

      expect(qb.skip).toHaveBeenCalled();
      expect(qb.take).toHaveBeenCalled();

      expect(result.data).toEqual(mockPendingRequests[0]);
      expect(result.meta.itemsCount).toBe(mockPendingRequests.length);
    });
  });

  describe("processRequest()", () => {
    it("approves a request and updates user role", async () => {
      const mockRequest = {
        id: "r1",
        userId: "u1",
        requestedRole: USER_ROLES.ADMIN,
        status: "PENDING",
      };

      const mockUser = {
        id: "u1",
        role: USER_ROLES.ADMIN,
      };

      const save = jest.fn();
      const preload = jest.fn().mockResolvedValue(mockUser);

      const getOne = jest.fn().mockResolvedValue(mockRequest);
      const where = jest.fn().mockReturnValue({ getOne });
      const createQueryBuilder = jest.fn().mockReturnValue({ where });

      const roleRequestRepoMock = {
        createQueryBuilder,
        save,
      };

      const userRepoMock = {
        save,
        preload,
      };

      const withRepository = jest
        .fn()
        .mockImplementation((repo) =>
          repo === roleManagementRepository
            ? roleRequestRepoMock
            : userRepoMock,
        );

      mockDataSource.transaction.mockImplementation((cb) =>
        cb({ withRepository }),
      );

      await roleManagementService.processRequest(true, "r1");

      expect(preload).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
    });

    it("throws NotFoundException if no request exists", async () => {
      const getOne = jest.fn().mockResolvedValue(null);
      const where = jest.fn().mockReturnValue({ getOne });
      const createQueryBuilder = jest.fn().mockReturnValue({ where });
      const repoMock = {
        createQueryBuilder,
      };
      const withRepository = jest.fn().mockReturnValue(repoMock);

      mockDataSource.transaction.mockImplementation((cb) =>
        cb({
          withRepository,
        }),
      );

      await expect(
        roleManagementService.processRequest(true, "r1"),
      ).rejects.toThrow(NotFoundException);
    });

    it("rejects request", async () => {
      const mockRequest = {
        id: "r1",
        userId: "u1",
        requestedRole: USER_ROLES.ADMIN,
        status: "PENDING",
      };
      const save = jest.fn();
      const getOne = jest.fn().mockResolvedValue(mockRequest);
      const where = jest.fn().mockReturnValue({ getOne });
      const createQueryBuilder = jest.fn().mockReturnValue({ where });
      const withRepository = jest.fn().mockReturnValue({
        createQueryBuilder,
        save,
      });

      mockDataSource.transaction.mockImplementation((cb) =>
        cb({
          withRepository,
        }),
      );

      await roleManagementService.processRequest(false, "r1");
      expect(save).toHaveBeenCalled();
    });
  });
});
