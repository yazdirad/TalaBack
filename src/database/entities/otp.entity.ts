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

@Entity('Otps')
@Index(['national_id', 'phone', 'code'])
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    otp_id: string;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    national_id: string;

    @Column({ type: 'nvarchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'nvarchar', length: 10 })
    code: string;

    @Column({ type: 'uuid', nullable: true })
    user_id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ type: 'bit', default: false })
    is_used: boolean;

    @CreateDateColumn()
    created_at: Date;
}
