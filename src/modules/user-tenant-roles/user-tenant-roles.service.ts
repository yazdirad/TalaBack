import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTenantRole } from '../../database/entities/user-tenant-role.entity';

@Injectable()
export class UserTenantRolesService {
    constructor(
        @InjectRepository(UserTenantRole)
        private userTenantRoleRepository: Repository<UserTenantRole>,
    ) {}

    async findUserTenantRoles(userId: string): Promise<UserTenantRole[]> {
        return this.userTenantRoleRepository.find({
            where: {
                user_id: userId,
                status: 'active',
            },
            relations: ['tenant', 'role', 'roleLevel'],
            order: {
                is_primary_tenant: 'DESC',
                assigned_at: 'DESC',
            },
        });
    }

    async findPrimaryTenantRole(userId: string): Promise<UserTenantRole | null> {
        return this.userTenantRoleRepository.findOne({
            where: {
                user_id: userId,
                is_primary_tenant: true,
                status: 'active',
            },
            relations: ['tenant', 'role', 'roleLevel'],
        });
    }

    async findUserTenantRole(
        userId: string,
        tenantId: string,
    ): Promise<UserTenantRole | null> {
        return this.userTenantRoleRepository.findOne({
            where: {
                user_id: userId,
                tenant_id: tenantId,
                status: 'active',
            },
            relations: ['role', 'roleLevel'],
        });
    }

    async assignUserTenantRole(
        userId: string,
        tenantId: string,
        roleId: number,
        roleLevelId: number,
        assignedByUserId: string,
        isPrimaryTenant: boolean = false,
    ): Promise<UserTenantRole> {
        // اگر isPrimaryTenant است، سایر tenant های اولی را حذف کنیم
        if (isPrimaryTenant) {
            await this.userTenantRoleRepository.update(
                { user_id: userId, is_primary_tenant: true },
                { is_primary_tenant: false },
            );
        }

        const userTenantRole = this.userTenantRoleRepository.create({
            user_id: userId,
            tenant_id: tenantId,
            role_id: roleId,
            role_level_id: roleLevelId,
            assigned_by_user_id: assignedByUserId,
            is_primary_tenant: isPrimaryTenant,
        });

        return this.userTenantRoleRepository.save(userTenantRole);
    }

    async deactivateUserTenantRole(
        userId: string,
        tenantId: string,
    ): Promise<void> {
        await this.userTenantRoleRepository.update(
            {
                user_id: userId,
                tenant_id: tenantId,
            },
            {
                status: 'inactive',
            },
        );
    }

    async findTenantUsers(tenantId: string): Promise<UserTenantRole[]> {
        return this.userTenantRoleRepository.find({
            where: {
                tenant_id: tenantId,
                status: 'active',
            },
            relations: ['user', 'role', 'roleLevel'],
        });
    }
}
