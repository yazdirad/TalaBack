import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';
import { Role } from './role.entity';
import { RoleLevel } from './role-level.entity';

@Entity('Sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    session_id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid', nullable: true })
    tenant_id: string;

    @ManyToOne(() => Tenant, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({ type: 'int', nullable: true })
    role_id: number;

    @ManyToOne(() => Role, { nullable: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ type: 'int', nullable: true })
    role_level_id: number;

    @ManyToOne(() => RoleLevel)
    @JoinColumn({ name: 'role_level_id' })
    roleLevel: RoleLevel;

    @Column({ type: 'nvarchar', nullable: false })
    access_token: string;

    @Column({ type: 'nvarchar', nullable: true })
    refresh_token: string;

    @CreateDateColumn()
    login_time: Date;

    @Column({ type: 'datetime', nullable: true })
    last_activity: Date;

    @Column({ type: 'datetime', nullable: true })
    expires_at: Date;

    @Column({ type: 'nvarchar', length: 45, nullable: true })
    ip_address: string;

    @Column({ type: 'nvarchar', nullable: true })
    user_agent: string;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    device_id: string;

    @Column({ type: 'nvarchar', length: 50, default: 'pending' })
    status: string;

    @Column({ type: 'datetime', nullable: true })
    revoked_at: Date;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    revoked_reason: string;

    @UpdateDateColumn()
    updated_at: Date;
}

