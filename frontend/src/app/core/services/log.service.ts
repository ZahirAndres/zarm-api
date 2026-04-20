import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Interfaz del registro de auditoría según el modelo Prisma (Log).
 */
export interface AuditLog {
  id: number;
  statusCode: number;
  timestamp: string;
  path: string;
  error: string;
  errorCode: string;
  session_id: number | null;
  user?: {
    id: number;
    username: string;
    name: string;
    lastname: string;
  } | null;
}

/**
 * Filtros disponibles para la consulta de registros de auditoría.
 */
export interface LogFilters {
  userId?: string;
  startDate?: string;
  endDate?: string;
  errorCode?: string;
}

/**
 * Servicio para consultar el módulo de auditoría del backend.
 * Solo funciona correctamente para usuarios con rol Admin (rol_id = 1),
 * ya que el endpoint /api/log está protegido server-side.
 */
@Injectable({
  providedIn: 'root'
})
export class LogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/log`;

  /**
   * Obtiene registros de auditoría con filtros opcionales.
   * La autorización Bearer es añadida automáticamente por el interceptor.
   */
  getLogs(filters: LogFilters = {}) {
    let params = new HttpParams();

    if (filters.userId) params = params.set('userId', filters.userId);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.errorCode) params = params.set('errorCode', filters.errorCode);

    return this.http.get<AuditLog[]>(this.apiUrl, { params });
  }
}
