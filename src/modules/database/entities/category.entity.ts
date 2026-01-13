import { Column, Entity, OneToMany, TreeLevelColumn } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { BlogpostEntity } from './blogpost.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  slug: string;

  @Column({
    unique: true,
    nullable: true,
  })
  description?: string;

  @Column({
    unique: true,
    nullable: false,
    default: false,
    type: Boolean,
  })
  isActive: boolean;

  @OneToMany(() => BlogpostEntity, (post) => post.categoryId)
  blogPosts: BlogpostEntity[];
}
