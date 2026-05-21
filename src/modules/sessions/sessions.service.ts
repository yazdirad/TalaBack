import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Session } from '../../database/entities/session.entity';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session)
        private sessionsRepository: Repository<Session>,
        private configService: ConfigService,
    ) {}

    async createSession(
        userId: string,
        accessToken: string,
        refreshToken: string,
        tenantId?: string,
        roleId?: number,
        roleLevelId?: number,
        deviceId?: string,
        ipAddress?: string,
        userAgent?: string,
        status: string = 'active',
    ): Promise<Session> {
        const jwtExpiration = this.configService.get<string>('JWT_EXPIRATION', '7d');
        const expiresAt = this.calculateExpirationDate(jwtExpiration);

        const session = this.sessionsRepository.create({
            user_id: userId,
            access_token: accessToken,
            refresh_token: refreshToken,
            tenant_id: tenantId,
            role_id: roleId,
            role_level_id: roleLevelId,
            device_id: deviceId,
            ip_address: ipAddress,
            user_agent: userAgent,
            expires_at: expiresAt,
            last_activity: new Date(),
            status,
        });

        return this.sessionsRepository.save(session);
    }

    async findActiveSession(sessionId: string): Promise<Session | null> {
        return this.sessionsRepository.findOne({
            where: {
                session_id: sessionId,
                status: 'active',
            },
        });
    }

    async findUserActiveSessions(userId: string): Promise<Session[]> {
        return this.sessionsRepository.find({
            where: {
                user_id: userId,
                status: 'active',
            },
            order: {
                login_time: 'DESC',
            },
        });
    }

    async findSessionByAccessToken(accessToken: string): Promise<Session | null> {
        return this.sessionsRepository.findOne({
            where: {
                access_token: accessToken,
                status: 'active',
            },
        });
    }

    async updateLastActivity(sessionId: string): Promise<void> {
        await this.sessionsRepository.update(
            { session_id: sessionId },
            { last_activity: new Date() },
        );
    }

    async revokeSession(sessionId: string, reason?: string): Promise<void> {
        await this.sessionsRepository.update(
            { session_id: sessionId },
            {
                status: 'revoked',
                revoked_at: new Date(),
                revoked_reason: reason,
            },
        );
    }

    async revokeAllUserSessions(userId: string, reason?: string): Promise<void> {
        await this.sessionsRepository.update(
            { user_id: userId, status: 'active' },
            {
                status: 'revoked',
                revoked_at: new Date(),
                revoked_reason: reason,
            },
        );
    }

    async revokeSessionByAdmin(sessionId: string, adminId: string, reason?: string): Promise<void> {
        const session = await this.sessionsRepository.findOne({
            where: { session_id: sessionId },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        const finalReason = reason || 'Revoked by admin';
        await this.revokeSession(sessionId, finalReason);
    }

    async cleanupExpiredSessions(): Promise<void> {
        const now = new Date();
        await this.sessionsRepository.delete({
            expires_at: LessThan(now),
        });
    }

    async getSessionDetails(sessionId: string): Promise<Session | null> {
        return this.sessionsRepository.findOne({
            where: { session_id: sessionId },
            relations: ['user', 'tenant', 'role', 'roleLevel'],
        });
    }

    async getSessionsByTenant(tenantId: string, status: string = 'active'): Promise<Session[]> {
        return this.sessionsRepository.find({
            where: {
                tenant_id: tenantId,
                status,
            },
            relations: ['user'],
            order: {
                login_time: 'DESC',
            },
        });
    }

    async activateSession(
        sessionId: string,
        tenantId: string,
        roleId: number,
        roleLevelId: number,
    ): Promise<void> {
        await this.sessionsRepository.update(
            { session_id: sessionId },
            {
                tenant_id: tenantId,
                role_id: roleId,
                role_level_id: roleLevelId,
                status: 'active',
            },
        );
    }

    private calculateExpirationDate(expirationStr: string): Date {
        const now = new Date();
        const match = expirationStr.match(/^(\d+)([dhms])$/);

        if (!match) {
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
        }

        const [, value, unit] = match;
        const numValue = parseInt(value, 10);

        switch (unit) {
            case 'd':
                return new Date(now.getTime() + numValue * 24 * 60 * 60 * 1000);
            case 'h':
                return new Date(now.getTime() + numValue * 60 * 60 * 1000);
            case 'm':
                return new Date(now.getTime() + numValue * 60 * 1000);
            case 's':
                return new Date(now.getTime() + numValue * 1000);
            default:
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
    }
}

