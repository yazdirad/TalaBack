import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { SelectTenantDto } from './dto/select-tenant.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Start login/register flow with national ID and phone' })
    async startAuth(@Body() loginDto: LoginDto) {
        return this.authService.startAuthentication(loginDto);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP and issue auth token' })
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto);
    }

    @Post('complete-profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Complete profile after new user registration' })
    async completeProfile(@Body() completeProfileDto: CompleteProfileDto, @Request() req: any) {
        return this.authService.completeProfile(req.user.user_id, completeProfileDto);
    }

    @Post('select-tenant')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Select tenant after OTP for existing users' })
    async selectTenant(@Body() selectTenantDto: SelectTenantDto, @Request() req: any) {
        return this.authService.selectTenant(req.user.user_id, req.user.session_id, selectTenantDto.tenant_id);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Logout from current session' })
    async logout(@Request() req: any) {
        const sessionId = req.user.session_id;
        if (!sessionId) {
            throw new BadRequestException('Session not found');
        }
        await this.authService.logout(sessionId);
        return { message: 'Successfully logged out' };
    }

    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Logout from all devices' })
    async logoutAll(@Request() req: any) {
        await this.authService.logoutAllDevices(req.user.sub);
        return { message: 'Successfully logged out from all devices' };
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(
        @Body() body: { user_id: string; refresh_token: string },
    ) {
        return this.authService.refreshAccessToken(body.user_id, body.refresh_token);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Request() req: any) {
        return req.user;
    }
}