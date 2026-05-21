import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UserTenantRolesModule } from '../user-tenant-roles/user-tenant-roles.module';
import { OtpsModule } from '../otps/otps.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                const jwtSecret = configService.get<string>('JWT_SECRET');
                const jwtExpiration = configService.get<string>('JWT_EXPIRATION') || '7d';
                return {
                    secret: jwtSecret,
                    signOptions: {
                        expiresIn: jwtExpiration as unknown as string | number,
                    },
                };
            },
            inject: [ConfigService],
        }),
        UsersModule,
        SessionsModule,
        UserTenantRolesModule,
        OtpsModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}