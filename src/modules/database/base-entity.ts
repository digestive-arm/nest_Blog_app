import { Exclude } from 'class-transformer';
import { UserEntity } from './entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  @Column({ nullable: true })
  createdBy?: string;

  @Exclude()
  @ManyToOne('UserEntity', { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator?: UserEntity;

  @Exclude()
  @Column({ nullable: true })
  updatedBy?: string;

  @Exclude()
  @ManyToOne('UserEntity', { nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  updater?: UserEntity;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt?: Date;
}
