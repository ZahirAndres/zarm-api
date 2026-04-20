import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PrismaService } from 'src/common/services/prisma.service';

/**
 * Controlador de Auditoría.
 * Solo accesible por usuarios con rol Entrenador (rol_id = 1).
 * Provee un endpoint para consultar los registros de eventos del sistema.
 */
@Controller('api/log')
@ApiTags('Audit Log')
@UseGuards(AuthGuard)
export class LogController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/log
   * Retorna registros de auditoría con filtros opcionales.
   * Solo administradores (rol_id = 1) pueden acceder.
   * Filtros disponibles:
   * - userId: ID del usuario que generó el evento
   * - startDate: Fecha inicio (ISO 8601)
   * - endDate: Fecha fin (ISO 8601)
   * - errorCode: Tipo de evento (LOGIN_FAILED, CREATE_TASK, etc.)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtiene registros de auditoría (solo Admin)' })
  async getLogs(
    @Req() request: any,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('errorCode') errorCode?: string,
  ) {
    // Verificación RBAC: solo Entrenador (rol_id = 1) puede consultar logs
    const session = request['user'];
    if (session.rol_id !== 1) {
      throw new ForbiddenException('No tienes permiso para consultar registros de auditoría');
    }

    const where: any = {};

    // Filtro por usuario
    if (userId) {
      const parsed = parseInt(userId, 10);
      if (!isNaN(parsed)) {
        where.session_id = parsed;
      }
    }

    // Filtro por tipo de evento / código
    if (errorCode && errorCode.trim() !== '') {
      where.errorCode = errorCode.trim();
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        // Inclusivo hasta fin del día
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.timestamp.lte = end;
      }
    }

    const logs = await this.prisma.log.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 500, // Límite de seguridad para evitar dumps masivos
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            lastname: true,
            // Excluidos: password, hash, refresh_token (privacidad)
          },
        },
      },
    });

    return logs;
  }
}
