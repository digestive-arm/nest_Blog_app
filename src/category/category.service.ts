import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateCategoryInput } from './interfaces/category.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/database/entities/category.entity';
import { Not, Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { generateSlug } from 'src/utils/blogpost.utils';
import { paginationInput } from 'src/common/interfaces/pagination.interfaces';
import { getPageinationMeta } from 'src/common/helper/pagination.helper';
import { getOffset } from '../common/helper/pagination.helper';
import { CATEGORY_SELECT } from './category.constants';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
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

  async findAll({ page, limit, isPagination }: paginationInput) {
    const qb = this.categoryRepository.createQueryBuilder('category');
    qb.select(CATEGORY_SELECT).where('category.isActive = :isActive', {
      isActive: true,
    });

    if (isPagination) {
      const offSet = getOffset(page, limit);
      qb.skip(offSet).take(limit);
    }
    const [items, total] = await qb.getManyAndCount();
    const result = getPageinationMeta({ items, total, page, limit });
    return result;
  }

  async findOne(id: string) {
    const qb = this.categoryRepository.createQueryBuilder('category');
    qb.select(CATEGORY_SELECT).where(
      'category.id = :id AND category.isActive = :isActive',
      {
        id,
        isActive: true,
      },
    );

    const result = await qb.getOne();

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryDto) {
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

    await this.categoryRepository.save(category);

    return category;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    await this.blogPostRepository
      .createQueryBuilder()
      .update()
      .set({ categoryId: () => 'NULL' })
      .where({ categoryId: id })
      .execute();

    await this.categoryRepository.softRemove(category);
  }
}
