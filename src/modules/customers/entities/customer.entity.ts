import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  createdBy: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: true })
  updatedBy: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
