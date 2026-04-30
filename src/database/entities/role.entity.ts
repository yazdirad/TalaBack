import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { RoleLevel } from './role-level.entity';

@Entity('Roles')
export class Role {
    @PrimaryGeneratedColumn()
    role_id: number;

    @Column({ type: 'nvarchar', length: 100, unique: true })
    role_name: string;

    @Column({ type: 'nvarchar', nullable: true })
    description: string;

    @Column({ type: 'nvarchar', length: 10, nullable: true })
    color_code: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    icon_name: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => RoleLevel, (roleLevel) => roleLevel.role)
    roleLevels: RoleLevel[];
}