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
import { Product } from './product.entity';

@Entity('Transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transaction_id: string;

    @Column('uuid')
    tenant_id: string;

    @Column({ type: 'nvarchar', length: 50 })
    transaction_type: string;

    @Column({ type: 'uuid', nullable: true })
    from_user_id: string;

    @Column({ type: 'uuid', nullable: true })
    to_user_id: string;

    @Column({ type: 'uuid', nullable: true })
    product_id: string;

    @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
    quantity: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    unit_price: number;

    @Column({ type: 'decimal', precision: 18, scale: 2 })
    total_amount: number;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    payment_method: string;

    @Column({ type: 'nvarchar', length: 50, default: 'pending' })
    status: string;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    reference_number: string;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    invoice_number: string;

    @Column({ type: 'nvarchar', nullable: true })
    description: string;

    @Column({ type: 'nvarchar', nullable: true })
    notes: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'datetime', nullable: true })
    completed_at: Date;

    @Column({ type: 'datetime', nullable: true })
    cancelled_at: Date;

    @Column({ type: 'nvarchar', nullable: true })
    cancelled_reason: string;

    @Column({ type: 'uuid', nullable: true })
    created_by_user_id: string;

    @Column({ type: 'uuid', nullable: true })
    approved_by_user_id: string;

    @Column({ type: 'datetime', nullable: true })
    approved_at: Date;

    @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'from_user_id' })
    fromUser: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'to_user_id' })
    toUser: User;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}