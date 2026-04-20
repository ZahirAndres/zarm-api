import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { PrismaService } from 'src/common/services/prisma.service';
import { UtilService } from 'src/common/services/util.service';

/**
 * Módulo de Auditoría.
 * Expone el endpoint GET /api/log para consultar registros del sistema.
 * JwtModule ya está registrado globalmente en AuthModule.
 */
@Module({
  controllers: [LogController],
  providers: [PrismaService, UtilService],
})
export class LogModule {}
