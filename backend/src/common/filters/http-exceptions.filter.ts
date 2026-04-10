import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaService } from "../services/prisma.service";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

    constructor(private readonly prismaSrv: PrismaService) {}
    
    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

        let message: string;
        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res as any).message || res;
        } else {
            message = exception.message || 'Error interno del servidor';
        }

        const user = request['user'];
        const sessionId = user?.id ? user.id : null;

        try {
            await this.prismaSrv.log.create({
                data: {
                    statusCode: status,
                    timestamp: new Date(),
                    path: request.url,
                    error: message,
                    errorCode: exception instanceof HttpException 
                        ? (exception as any).code || 'HTTP_ERROR'
                        : 'INTERNAL_ERROR',
                    session_id: sessionId,
                },
            });
        } catch (dbError) {
            console.error('Error al guardar el log:', dbError);
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