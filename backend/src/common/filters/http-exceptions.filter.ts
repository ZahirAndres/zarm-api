import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

export class AllExceptionFilter implements ExceptionFilter {
    
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

        // V-20: Solo exponer mensajes de HttpException, no errores internos
        let message: string;
        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res as any).message || res;
        } else {
            message = exception.message || 'Error interno del servidor';
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message,
            errorCode: exception instanceof HttpException 
                ? (exception as any).code || 'HTTP_ERROR'
                : 'INTERNAL_ERROR',
        })
    }
}