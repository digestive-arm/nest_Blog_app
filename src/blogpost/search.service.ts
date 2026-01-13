import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { Repository } from 'typeorm';
import { SearchBlogPostDto } from './dto/search.dto';
import { getPageinationMeta } from 'src/common/helper/pagination.helper';
import { paginationMeta } from 'src/common/interfaces/pagination.interfaces';
import {
  applySearch,
  applyPagination,
  applyFilters,
} from '../utils/search.utils';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(BlogpostEntity)
    private readonly blogPostEntity: Repository<BlogpostEntity>,
  ) {}

  async search(query: SearchBlogPostDto): Promise<paginationMeta> {
    const qb = this.blogPostEntity.createQueryBuilder('post');

    applySearch(qb, query);
    applyFilters(qb);
    applyPagination(qb, query);

    const [items, total] = await qb.getManyAndCount();
    const result = getPageinationMeta({
      items,
      page: query.page,
      limit: query.limit,
      total,
    });
    return result;
  }
}
