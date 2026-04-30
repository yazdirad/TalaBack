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
import { User } from './user.entity';
import { Tenant } from './tenant.entity';
import { WalletMetal } from './wallet-metal.entity';

@Entity('Wallets')
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    wallet_id: string;

    @Column('uuid')
    user_id: string;

    @Column('uuid')
    tenant_id: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
    wallet_balance: number;

    @Column({ type: 'bit', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @OneToMany(() => WalletMetal, (wm) => wm.wallet)
    walletMetals: WalletMetal[];
}