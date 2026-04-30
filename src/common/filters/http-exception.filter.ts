import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private logger = new Logger('ExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details: any = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object') {
                message = (exceptionResponse as any).message || message;
                details = exceptionResponse;
            } else {
                message = exceptionResponse as string;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        this.logger.error(
            `[${request.method}] ${request.url} - ${status}: ${message}`,
        );

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            details,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}