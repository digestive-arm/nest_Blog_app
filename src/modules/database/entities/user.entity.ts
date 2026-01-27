import { Entity, Column, OneToMany } from "typeorm";

import { USER_ROLES } from "../../../user/user-types";
import { BaseEntity } from "../base-entity";

import { BlogpostEntity } from "./blogpost.entity";
import { CommentEntity } from "./comment.entity";
import { RoleApproval } from "./role-management.entity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: false, select: true })
  userName: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({
    unique: true,
    nullable: false,
    select: true,
  })
  email: string;

  @Column({
    nullable: false,
    length: 100,
  })
  password: string;

  @Column({
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @Column({
    default: USER_ROLES.READER,
  })
  role: USER_ROLES;

  @Column({
    nullable: true,
  })
  refreshToken?: string;

  @OneToMany(() => RoleApproval, (approval) => approval.user)
  roleRequest: RoleApproval[];

  @OneToMany(() => BlogpostEntity, (post) => post.authorId)
  blogPosts: BlogpostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    nullable: true,
  })
  comment?: CommentEntity[];
}
