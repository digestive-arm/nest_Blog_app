import { BaseEntity } from 'src/modules/database/base-entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BLOG_POST_STATUS } from '../blogpost-types';

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

  @ManyToOne('User', {
    nullable: true,
  })
  @JoinColumn({
    name: 'authorId',
  })
  user?: User;

  @Column({
    type: 'enum',
    enum: BLOG_POST_STATUS,
    default: BLOG_POST_STATUS.DRAFT,
    nullable: false,
  })
  status: BLOG_POST_STATUS;
}
