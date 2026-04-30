import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('Products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    product_id: string;

    @Column('uuid')
    tenant_id: string;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    product_name: string;

    @Column()
    metal_id: number;

    @Column()
    purity: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    purity_percentage: number;

    @Column({ type: 'nvarchar', nullable: true })
    description: string;

    @Column({ type: 'bit', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Tenant, (tenant) => tenant.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}