import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { UserEntity } from './user.entity';
import { BLOG_POST_STATUS } from '../../../blogpost/blogpost-types';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';

@Entity('blogpost')
export class BlogpostEntity extends BaseEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  title: string;
  @Column({
    nullable: false,
  })
  content: string;

  @Column({
    nullable: false,
    unique: true,
  })
  slug: string;
  @Column({
    nullable: true,
  })
  summary?: string;

  @Column({
    nullable: false,
  })
  authorId: string;

  @ManyToOne('UserEntity', {
    nullable: true,
  })
  @JoinColumn({
    name: 'authorId',
  })
  user?: UserEntity;

  @Column({
    type: 'enum',
    enum: BLOG_POST_STATUS,
    default: BLOG_POST_STATUS.DRAFT,
    nullable: false,
  })
  status: BLOG_POST_STATUS;

  @Column({
    nullable: true,
  })
  categoryId?: string;

  @ManyToOne(() => CategoryEntity, (category) => category.blogPosts, {
    nullable: true,
  })
  @JoinColumn({
    name: 'categoryId',
  })
  category?: CategoryEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.blogPost, {
    nullable: true,
  })
  comments?: CommentEntity[];
}
