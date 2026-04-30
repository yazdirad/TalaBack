import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { RoleLevelPermission } from './role-level-permission.entity';

@Entity('RoleLevels')
export class RoleLevel {
    @PrimaryGeneratedColumn()
    role_level_id: number;

    @Column()
    role_id: number;

    @Column()
    level_number: number;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    level_name: string;

    @Column({ type: 'nvarchar', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    max_transaction_amount: number;

    @Column({ type: 'int', nullable: true })
    max_daily_transaction_count: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Role, (role) => role.roleLevels, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToMany(() => RoleLevelPermission, (rlp) => rlp.roleLevel)
    roleLevelPermissions: RoleLevelPermission[];
}