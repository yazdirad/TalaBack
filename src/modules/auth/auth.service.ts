import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { UserTenantRolesService } from '../user-tenant-roles/user-tenant-roles.service';
import { OtpsService } from '../otps/otps.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { SelectTenantDto } from './dto/select-tenant.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private sessionsService: SessionsService,
        private userTenantRolesService: UserTenantRolesService,
        private otpsService: OtpsService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async startAuthentication(loginDto: LoginDto) {
        const { national_id, phone } = loginDto;
        let user = await this.usersService.findByNationalId(national_id);
        const phoneUser = await this.usersService.findByPhone(phone);

        const isExistingUser = Boolean(user || phoneUser);

        if (user && phoneUser && user.user_id !== phoneUser.user_id) {
            throw new BadRequestException('National ID and phone do not match existing user');
        }

        if (!user) {
            if (phoneUser) {
                user = phoneUser;
                if (user.national_id && user.national_id !== national_id) {
                    throw new BadRequestException('Phone number already registered with different national ID');
                }
            }
        }

        if (!user) {
            user = await this.usersService.create({
                national_id,
                phone,
                is_profile_completed: false,
                status: 'pending_profile',
            });
        }

        await this.otpsService.sendOtp(national_id, phone, user.user_id);

        return {
            is_new_user: !isExistingUser,
            message: 'OTP has been sent to the provided phone number',
        };
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const { national_id, phone, otp, user_agent, ip_address } = verifyOtpDto;
        await this.otpsService.validateOtp(national_id, phone, otp);

        const user = await this.usersService.findByNationalId(national_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const payload = {
            sub: user.user_id,
            national_id,
        } as Record<string, any>;

        const accessToken = this.jwtService.sign(payload);
        const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '30d';
        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
        if (!refreshSecret) {
            throw new UnauthorizedException('Refresh token secret is not configured');
        }

        const refreshToken = this.jwtService.sign(payload, {
            secret: refreshSecret,
            expiresIn: refreshExpiration as unknown as string | number,
        });

        const session = await this.sessionsService.createSession(
            user.user_id,
            accessToken,
            refreshToken,
            undefined,
            undefined,
            undefined,
            undefined,
            ip_address,
            user_agent,
            'pending',
        );

        const tenantRoles = await this.userTenantRolesService.findUserTenantRoles(user.user_id);

        return {
            session_id: session.session_id,
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                user_id: user.user_id,
                national_id: user.national_id,
                phone: user.phone,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                is_profile_completed: user.is_profile_completed,
            },
            is_new_user: user.status === 'pending_profile',
            profile_completed: user.is_profile_completed,
            tenants: tenantRoles.map((role) => ({
                tenant_id: role.tenant_id,
                tenant_name: role.tenant?.tenant_name,
                role_id: role.role_id,
                role_name: role.role?.role_name,
                role_level_id: role.role_level_id,
            })),
            expires_in: this.configService.get<string>('JWT_EXPIRATION', '7d'),
        };
    }

    async completeProfile(userId: string, completeProfileDto: CompleteProfileDto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.is_profile_completed) {
            throw new BadRequestException('Profile is already completed');
        }

        await this.usersService.completeProfile(userId, {
            email: completeProfileDto.email,
            first_name: completeProfileDto.first_name,
            last_name: completeProfileDto.last_name,
            phone: completeProfileDto.phone || user.phone,
        });

        return {
            message: 'Profile completed successfully',
        };
    }

    async selectTenant(userId: string, sessionId: string, tenantId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.is_profile_completed) {
            throw new BadRequestException('Complete your profile first');
        }

        const tenantRole = await this.userTenantRolesService.findUserTenantRole(userId, tenantId);
        if (!tenantRole) {
            throw new NotFoundException('Tenant role not found for user');
        }

        await this.sessionsService.activateSession(
            sessionId,
            tenantRole.tenant_id,
            tenantRole.role_id,
            tenantRole.role_level_id,
        );

        return {
            tenant_id: tenantRole.tenant_id,
            tenant_name: tenantRole.tenant?.tenant_name,
            role_id: tenantRole.role_id,
            role_name: tenantRole.role?.role_name,
            role_level_id: tenantRole.role_level_id,
            session_id: sessionId,
        };
    }

    async logout(sessionId: string, reason?: string): Promise<void> {
        await this.sessionsService.revokeSession(sessionId, reason);
    }

    async logoutAllDevices(userId: string, reason?: string): Promise<void> {
        await this.sessionsService.revokeAllUserSessions(userId, reason);
    }

    async validateSession(sessionId: string): Promise<boolean> {
        const session = await this.sessionsService.findActiveSession(sessionId);
        if (!session) {
            return false;
        }

        await this.sessionsService.updateLastActivity(sessionId);
        return true;
    }

    async refreshAccessToken(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const payload = {
            sub: user.user_id,
            national_id: user.national_id,
        };

        const newAccessToken = this.jwtService.sign(payload);
        return {
            access_token: newAccessToken,
            expires_in: this.configService.get<string>('JWT_EXPIRATION', '7d'),
        };
    }
}