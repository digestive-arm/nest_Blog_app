import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BlogpostEntity } from './blogpost.entity';
import { COMMENT_STATUS } from '../../../comments/comments-types';
import { UserEntity } from './user.entity';
import { BaseEntity } from '../base-entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  content: string;

  @Column({
    nullable: false,
    default: COMMENT_STATUS.PENDING,
    type: 'enum',
    enum: COMMENT_STATUS,
  })
  status: COMMENT_STATUS;

  @Column({
    nullable: false,
  })
  authorId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'authorId',
  })
  user: UserEntity;

  @Column({
    nullable: false,
  })
  postId: string;

  @ManyToOne(() => BlogpostEntity)
  @JoinColumn({
    name: 'postId',
  })
  blogPost: BlogpostEntity;
}
