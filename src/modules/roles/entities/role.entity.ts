import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import {
    UserRole
} from 'src/comman/types';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column({default: "123456"})
    password: string;

    @Column({ default: true })
    status: boolean;

    @Column({ nullable: true })
    createdBy: number; // kim yaratgan (foydalanuvchi id si)

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ nullable: true })
    updatedBy: number; // kim yangilagan (foydalanuvchi id si)

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
