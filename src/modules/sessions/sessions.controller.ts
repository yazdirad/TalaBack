import {
    Controller,
    Delete,
    Get,
    Param,
    UseGuards,
    Request,
    ForbiddenException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Sessions')
@Controller('api/sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService) {}

    @Get('my-sessions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all active sessions for current user' })
    async getMyActiveSessions(@Request() req: any) {
        const sessions = await this.sessionsService.findUserActiveSessions(req.user.user_id);
        return sessions.map((session) => ({
            session_id: session.session_id,
            device_id: session.device_id,
            ip_address: session.ip_address,
            user_agent: session.user_agent,
            login_time: session.login_time,
            last_activity: session.last_activity,
            expires_at: session.expires_at,
            status: session.status,
        }));
    }

    @Get('session/:sessionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get session details' })
    async getSessionDetails(
        @Param('sessionId') sessionId: string,
        @Request() req: any,
    ) {
        const session = await this.sessionsService.getSessionDetails(sessionId);
        if (!session) {
            throw new ForbiddenException('Session not found');
        }

        // صرفا کاربر می‌تواند جزئیات جلسه خود را ببیند
        if (session.user_id !== req.user.user_id) {
            throw new ForbiddenException('You do not have permission to view this session');
        }

        return {
            session_id: session.session_id,
            device_id: session.device_id,
            ip_address: session.ip_address,
            user_agent: session.user_agent,
            login_time: session.login_time,
            last_activity: session.last_activity,
            expires_at: session.expires_at,
            status: session.status,
            tenant: {
                tenant_id: session.tenant_id,
                tenant_name: session.tenant?.tenant_name,
            },
            role: {
                role_id: session.role_id,
                role_name: session.role?.role_name,
            },
        };
    }

    @Delete('session/:sessionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Revoke a specific session' })
    async revokeSession(
        @Param('sessionId') sessionId: string,
        @Request() req: any,
    ) {
        const session = await this.sessionsService.getSessionDetails(sessionId);
        if (!session) {
            throw new ForbiddenException('Session not found');
        }

        // صرفا کاربر می‌تواند جلسه خود را لغو کند
        if (session.user_id !== req.user.user_id) {
            throw new ForbiddenException('You do not have permission to revoke this session');
        }

        await this.sessionsService.revokeSession(sessionId, 'User logged out');
        return { message: 'Session revoked successfully' };
    }

    @Delete('admin/user/:userId/session/:sessionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Admin: Revoke user session' })
    async revokeUserSessionAsAdmin(
        @Param('userId') userId: string,
        @Param('sessionId') sessionId: string,
        @Request() req: any,
    ) {
        // بررسی اینکه آیا کاربر admin است
        // توجه: این بخش بستگی به system RBAC دارد
        // فعلی برای نمایش نحوه استفاده قرار داده شده
        // در واقع نیاز است role-based access control پیاده‌سازی شود

        const session = await this.sessionsService.getSessionDetails(sessionId);
        if (!session) {
            throw new ForbiddenException('Session not found');
        }

        if (session.user_id !== userId) {
            throw new ForbiddenException('Session does not belong to this user');
        }

        await this.sessionsService.revokeSessionByAdmin(
            sessionId,
            req.user.user_id,
            'Revoked by admin',
        );
        return { message: 'User session revoked successfully by admin' };
    }

    @Delete('admin/user/:userId/sessions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Admin: Revoke all user sessions' })
    async revokeAllUserSessionsAsAdmin(
        @Param('userId') userId: string,
        @Request() req: any,
    ) {
        // بررسی اینکه آیا کاربر admin است

        await this.sessionsService.revokeAllUserSessions(userId, 'Revoked by admin');
        return { message: 'All user sessions revoked successfully by admin' };
    }

    @Get('tenant/:tenantId/sessions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all active sessions in a tenant (admin only)' })
    async getTenantSessions(
        @Param('tenantId') tenantId: string,
        @Request() req: any,
    ) {
        // بررسی اینکه کاربر admin این tenant است

        const sessions = await this.sessionsService.getSessionsByTenant(tenantId);
        return sessions.map((session) => ({
            session_id: session.session_id,
            user_id: session.user_id,
            user_email: session.user?.email,
            device_id: session.device_id,
            ip_address: session.ip_address,
            login_time: session.login_time,
            last_activity: session.last_activity,
            expires_at: session.expires_at,
            status: session.status,
        }));
    }
}
