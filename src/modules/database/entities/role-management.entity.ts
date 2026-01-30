import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { USER_ROLES } from "../../../user/user-types";

import { BaseEntity } from "./base-entity";
import { UserEntity } from "./user.entity";

export enum RoleApprovalStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

@Entity("role-approvals")
export class RoleApproval extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne("UserEntity", { nullable: true })
  @JoinColumn({ name: "userId" })
  user?: UserEntity;

  @Column({
    nullable: false,
  })
  requestedRole: USER_ROLES;

  @Column({
    default: RoleApprovalStatus.PENDING,
    nullable: false,
    enum: RoleApprovalStatus,
  })
  status: RoleApprovalStatus;
}
