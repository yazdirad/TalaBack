import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { RoleLevel } from './role-level.entity';
import { Permission } from './permission.entity';

@Entity('RoleLevelPermissions')
export class RoleLevelPermission {
    @PrimaryGeneratedColumn()
    role_level_permission_id: number;

    @Column()
    role_level_id: number;

    @Column()
    permission_id: number;

    @ManyToOne(() => RoleLevel, (rl) => rl.roleLevelPermissions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'role_level_id' })
    roleLevel: RoleLevel;

    @ManyToOne(() => Permission, (p) => p.roleLevelPermissions)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}