import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { BlogpostEntity } from './blogpost.entity';

@Entity('attachments')
export class AttachmentEntity extends BaseEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  publicId: string;

  @Column({
    nullable: false,
  })
  url: string;

  @Column({
    nullable: false,
  })
  postId: string;

  @ManyToOne(() => BlogpostEntity, (blopost) => blopost.attachments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'postId',
  })
  blogPost: BlogpostEntity;
}
