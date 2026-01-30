import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { COMMENT_STATUS } from "../../../comments/comments-types";

import { BaseEntity } from "./base-entity";
import { BlogpostEntity } from "./blogpost.entity";
import { UserEntity } from "./user.entity";

@Entity("comments")
export class CommentEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  content: string;

  @Column({
    nullable: false,
    default: COMMENT_STATUS.PENDING,
  })
  status: COMMENT_STATUS;

  @Column({
    nullable: false,
  })
  authorId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: "authorId",
  })
  user: UserEntity;

  @Column({
    nullable: false,
  })
  postId: string;

  @ManyToOne(() => BlogpostEntity, (blogpost) => blogpost.attachments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "postId",
  })
  blogPost: BlogpostEntity;
}
