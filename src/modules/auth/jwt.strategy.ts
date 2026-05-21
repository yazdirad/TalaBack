import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private sessionsService: SessionsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: any) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // استخراج access token
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        // پیدا کردن session
        const session = await this.sessionsService.findSessionByAccessToken(token);
        if (!session || session.status !== 'active') {
            throw new UnauthorizedException('Session not active');
        }

        return {
            session_id: session.session_id,
            user_id: payload.sub,
            email: payload.email,
            first_name: user.first_name,
            last_name: user.last_name,
            sub: payload.sub,
        };
    }
}