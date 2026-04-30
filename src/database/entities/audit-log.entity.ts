import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity('AuditLog')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    audit_id: string;

    @Column('uuid')
    tenant_id: string;

    @Column({ type: 'uuid', nullable: true })
    user_id: string;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    action: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    entity_type: string;

    @Column({ type: 'nvarchar', nullable: true })
    entity_id: string;

    @Column({ type: 'nvarchar', nullable: true })
    old_value: string;

    @Column({ type: 'nvarchar', nullable: true })
    new_value: string;

    @Column({ type: 'nvarchar', length: 45, nullable: true })
    ip_address: string;

    @Column({ type: 'nvarchar', nullable: true })
    user_agent: string;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    status: string;

    @Column({ type: 'nvarchar', nullable: true })
    error_message: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}