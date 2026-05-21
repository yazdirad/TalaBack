import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';
import { Role } from './role.entity';
import { RoleLevel } from './role-level.entity';

@Entity('UserTenantRoles')
@Index(['user_id', 'tenant_id', 'role_id'], { unique: true })
export class UserTenantRole {
    @PrimaryGeneratedColumn('uuid')
    user_tenant_role_id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid' })
    tenant_id: string;

    @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({ type: 'int' })
    role_id: number;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ type: 'int' })
    role_level_id: number;

    @ManyToOne(() => RoleLevel)
    @JoinColumn({ name: 'role_level_id' })
    roleLevel: RoleLevel;

    @Column({ type: 'bit', default: false })
    is_primary_tenant: boolean;

    @Column({ type: 'nvarchar', length: 50, default: 'active' })
    status: string;

    @CreateDateColumn()
    assigned_at: Date;

    @Column({ type: 'uuid', nullable: true })
    assigned_by_user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'assigned_by_user_id' })
    assignedBy: User;
}
