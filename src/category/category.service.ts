import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Not, Repository } from "typeorm";

import {
  getPaginationMeta,
  getOffset,
} from "src/common/helper/pagination.helper";
import {
  PaginationInput,
  PaginationMeta,
} from "src/common/interfaces/pagination.interfaces";
import { ERROR_MESSAGES } from "src/constants/messages.constants";
import { CategoryEntity } from "src/modules/database/entities/category.entity";
import { generateSlug } from "src/utils/blogpost.utils";

import {
  categoryCacheKeyById,
  categoryListCacheKey,
  invalidateCategoryCacheKeyById,
} from "./category.cache-keys";
import { CATEGORY_CONSTANTS } from "./category.constants";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./interfaces/category.interface";

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create({ name, description }: CreateCategoryInput): Promise<void> {
    const existing = await this.categoryRepository.exists({
      where: {
        name,
      },
    });
    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.CONFLICT);
    }

    const category = this.categoryRepository.create({
      name,
      description,
      isActive: true,
    });
    const slug = generateSlug(name, category.id);
    category.slug = slug;
    await this.categoryRepository.save(category);
  }

  async findAll({
    page,
    limit,
    isPagination,
  }: PaginationInput): Promise<PaginationMeta<CategoryEntity>> {
    const cacheKey = categoryListCacheKey({ page, limit, isPagination });
    const cached =
      await this.cache.get<PaginationMeta<CategoryEntity>>(cacheKey);
    if (cached) return cached;
    const qb = this.categoryRepository.createQueryBuilder("category");
    qb.select(CATEGORY_CONSTANTS.GET_ALL_CATEGORY_SELECT).where(
      "category.isActive = :isActive",
      {
        isActive: true,
      },
    );

    if (isPagination) {
      const offSet = getOffset(page, limit);
      qb.skip(offSet).take(limit);
    }
    const [items, total] = await qb.getManyAndCount();
    const result = getPaginationMeta({ items, total, page, limit });

    await this.cache.set(cacheKey, result);
    return result;
  }

  async findOne(id: string): Promise<CategoryEntity | null> {
    const cacheKey = categoryCacheKeyById(id);
    const cached = await this.cache.get<CategoryEntity>(cacheKey);
    if (cached) return cached;

    const result = await this.categoryRepository
      .createQueryBuilder("category")
      .select(CATEGORY_CONSTANTS.CATEGORY_SELECT)
      .where("category.id = :id AND category.isActive = :isActive", {
        id,
        isActive: true,
      })
      .getOne();

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.cache.set(cacheKey, result);
    return result;
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    if (updateCategoryInput.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryInput.name,
          id: Not(id), // exclude current category
        },
      });

      if (existingCategory) {
        throw new ConflictException(ERROR_MESSAGES.CONFLICT);
      }

      category.name = updateCategoryInput.name;
      category.slug = generateSlug(updateCategoryInput.name, category.id);
    }

    if (updateCategoryInput.description !== undefined) {
      category.description = updateCategoryInput.description;
    }

    if (updateCategoryInput.isActive !== undefined) {
      category.isActive = updateCategoryInput.isActive;
    }
    await invalidateCategoryCacheKeyById(this.cache, category.id);
    await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    await invalidateCategoryCacheKeyById(this.cache, category.id);
    await this.categoryRepository.softRemove(category);
  }
}
