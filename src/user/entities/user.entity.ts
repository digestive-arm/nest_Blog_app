import { Entity, Column, OneToMany } from 'typeorm';
import { userRoles } from '../user-types';
import { RoleApproval } from 'src/entities/role-approval.entity';
import { BaseEntity } from 'src/modules/database/base-entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false, select: true })
  username: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

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
    default: userRoles.READER,
  })
  role: userRoles;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @OneToMany(() => RoleApproval, (approval) => approval.user)
  roleRequest: RoleApproval[];
}
