import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Product } from './product.entity';

@Entity('WalletMetals')
export class WalletMetal {
    @PrimaryGeneratedColumn('uuid')
    wallet_metal_id: string;

    @Column('uuid')
    wallet_id: string;

    @Column('uuid')
    product_id: string;

    @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
    quantity: number;

    @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
    reserved_quantity: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Wallet, (wallet) => wallet.walletMetals, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}