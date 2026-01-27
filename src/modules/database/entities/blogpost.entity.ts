import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BLOG_POST_STATUS } from "../../../blogpost/blogpost-types";
import { BaseEntity } from "../base-entity";

import { AttachmentEntity } from "./attachment.entity";
import { CategoryEntity } from "./category.entity";
import { CommentEntity } from "./comment.entity";
import { UserEntity } from "./user.entity";

@Entity("blogpost")
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

  @ManyToOne("UserEntity", {
    nullable: true,
  })
  @JoinColumn({
    name: "authorId",
  })
  user?: UserEntity;

  @Column({
    type: "enum",
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
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({
    name: "categoryId",
  })
  category?: CategoryEntity;

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.blogPost, {
    cascade: true,
  })
  attachments: AttachmentEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.blogPost, {
    nullable: true,
  })
  comments?: CommentEntity[];
}
