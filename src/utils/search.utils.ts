import { BLOG_POST_STATUS } from 'src/blogpost/blogpost-types';
import { SearchBlogPostDto } from 'src/blogpost/dto/search.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { getOffset } from 'src/common/helper/pagination.helper';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { SelectQueryBuilder } from 'typeorm';

export function applySearch(
  qb: SelectQueryBuilder<BlogpostEntity>,
  { q }: SearchBlogPostDto,
) {
  if (!q) return;

  qb.andWhere(`(post.title ILIKE :q OR post.content ILIKE :q)`, {
    q: `%${q}%`,
  });
}

export function applyFilters(qb: SelectQueryBuilder<BlogpostEntity>) {
  qb.andWhere('post.status = :status', { status: BLOG_POST_STATUS.PUBLISHED });
}

export function applyPagination(
  qb: SelectQueryBuilder<BlogpostEntity>,
  { page, limit, isPagination }: PaginationDto,
) {
  if (!isPagination) return;

  const offset = getOffset(page, limit);

  qb.skip(offset).take(limit);
}
