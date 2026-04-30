import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: any): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, user } = request;
        const userInfo = user ? `[${user.email}]` : '[Anonymous]';

        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const { statusCode } = response;
                const delay = Date.now() - now;

                this.logger.log(
                    `${method} ${url} ${userInfo} - ${statusCode} ${delay}ms`,
                );
            }),
        );
    }
}