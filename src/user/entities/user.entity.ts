import { Entity, Column, OneToMany } from 'typeorm';
import { userRoles } from '../user-types';
import { RoleApproval } from '../../role-management/entities/role-management.entity';
import { BaseEntity } from '../../modules/database/base-entity';
import { BlogpostEntity } from '../../blogpost/entities/blogpost.entity';

@Entity()
export class User extends BaseEntity {
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
    default: userRoles.READER,
  })
  role: userRoles;

  @Column({
    nullable: true,
  })
  refreshToken?: string;

  @OneToMany(() => RoleApproval, (approval) => approval.user)
  roleRequest: RoleApproval[];

  @OneToMany(() => BlogpostEntity, (post) => post.authorId)
  blogPosts: BlogpostEntity[];
}
