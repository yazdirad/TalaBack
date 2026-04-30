import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('Tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    tenant_id: string;

    @Column({ type: 'nvarchar', length: 255 })
    tenant_name: string;

    @Column({ type: 'uuid', nullable: true })
    owner_user_id: string;

    @Column({ type: 'nvarchar', length: 50, default: 'active' })
    status: string;

    @Column({ type: 'nvarchar', length: 50, default: 'basic' })
    subscription_type: string;

    @Column({ type: 'datetime', nullable: true })
    subscription_start_date: Date;

    @Column({ type: 'datetime', nullable: true })
    subscription_end_date: Date;

    @Column({ type: 'int', default: 50 })
    max_users: number;

    @Column({ type: 'bit', default: false })
    allow_cross_tenant_transactions: boolean;

    @Column({ type: 'nvarchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'nvarchar', nullable: true })
    address: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    city: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    province: string;

    @Column({ type: 'nvarchar', length: 20, nullable: true })
    postal_code: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    country: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => User, (user) => user.tenant)
    users: User[];

    @OneToMany(() => Product, (product) => product.tenant)
    products: Product[];
}