import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { RoleLevelPermission } from './role-level-permission.entity';

@Entity('Permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    permission_id: number;

    @Column({ type: 'nvarchar', length: 255, unique: true })
    permission_name: string;

    @Column({ type: 'nvarchar', nullable: true })
    description: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    category: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => RoleLevelPermission, (rlp) => rlp.permission)
    roleLevelPermissions: RoleLevelPermission[];
}