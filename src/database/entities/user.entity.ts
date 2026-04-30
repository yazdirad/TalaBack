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
import { Tenant } from './tenant.entity';
import { Wallet } from './wallet.entity';

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ type: 'nvarchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'nvarchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    first_name: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    last_name: string;

    @Column({ type: 'nvarchar' })
    password_hash: string;

    @Column({ type: 'nvarchar', length: 50, default: 'active' })
    status: string;

    @Column({ type: 'bit', default: false })
    is_verified: boolean;

    @Column({ type: 'bit', default: false })
    is_email_verified: boolean;

    @Column({ type: 'bit', default: false })
    is_phone_verified: boolean;

    @Column({ type: 'datetime', nullable: true })
    last_login: Date;

    @Column({ type: 'datetime', nullable: true })
    last_password_change: Date;

    @Column({ type: 'bit', default: false })
    two_factor_enabled: boolean;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    two_factor_method: string;

    @Column({ type: 'nvarchar', nullable: true })
    profile_picture_url: string;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    national_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Wallet, (wallet) => wallet.user)
    wallets: Wallet[];
}