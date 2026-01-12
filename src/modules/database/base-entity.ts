import { Exclude } from 'class-transformer';
import { User } from './entities/user.entity';
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
  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator?: User;

  @Exclude()
  @Column({ nullable: true })
  updatedBy?: string;

  @Exclude()
  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  updater?: User;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt?: Date;
}
