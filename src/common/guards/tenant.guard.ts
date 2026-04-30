import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const { user } = request;

        if (!user || !user.tenantId) {
            throw new ForbiddenException('Tenant information is required');
        }

        return true;
    }
}