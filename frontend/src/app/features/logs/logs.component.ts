import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { LogService, AuditLog } from '../../core/services/log.service';
import { AlertService } from '../../shared/services/alert';

/**
 * Tipos de eventos disponibles para filtrar en la interfaz de auditoría.
 * Corresponden a los errorCode registrados en el backend.
 */
const EVENT_TYPES = [
  { value: '', label: 'Todos los eventos' },
  { value: 'LOGIN_SUCCESS', label: '✅ Login Exitoso' },
  { value: 'LOGIN_FAILED', label: '🔴 Login Fallido' },
  { value: 'CREATE_TASK', label: '📝 Tarea Creada' },
  { value: 'DELETE_TASK', label: '🗑️ Tarea Eliminada' },
  { value: 'CHANGE_ROLE', label: '🔑 Cambio de Rol' },
  { value: 'HTTP_ERROR', label: '⚠️ Error HTTP' },
  { value: 'INTERNAL_ERROR', label: '💥 Error Interno' },
];

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {
  private logService = inject(LogService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  logs = signal<AuditLog[]>([]);
  isLoading = signal<boolean>(false);
  eventTypes = EVENT_TYPES;

  /** Formulario de filtros */
  filterForm: FormGroup = this.fb.group({
    userId: [''],
    startDate: [''],
    endDate: [''],
    errorCode: ['']
  });

  /** Estadísticas calculadas sobre los logs actuales */
  totalLogs = computed(() => this.logs().length);
  failedLogins = computed(() => this.logs().filter(l => l.errorCode === 'LOGIN_FAILED').length);
  criticalErrors = computed(() => this.logs().filter(l => l.statusCode >= 500).length);

  ngOnInit() {
    this.loadLogs();
  }

  /**
   * Carga los registros de auditoría aplicando los filtros del formulario.
   */
  loadLogs() {
    this.isLoading.set(true);
    const filters = this.filterForm.value;

    // Limpiar valores vacíos para no enviar parámetros innecesarios
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
    );

    this.logService.getLogs(cleanFilters).subscribe({
      next: (data) => {
        this.logs.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 403) {
          this.alertService.error('Acceso denegado', 'No tienes permisos para ver los registros de auditoría.');
        } else {
          this.alertService.error('Error', 'No se pudieron cargar los registros.');
        }
      }
    });
  }

  applyFilters() {
    this.loadLogs();
  }

  clearFilters() {
    this.filterForm.reset({ userId: '', startDate: '', endDate: '', errorCode: '' });
    this.loadLogs();
  }

  /**
   * Devuelve la clase CSS del badge según el código de evento.
   */
  getBadgeClass(errorCode: string): string {
    const map: Record<string, string> = {
      'LOGIN_SUCCESS': 'badge-success',
      'LOGIN_FAILED': 'badge-danger',
      'CREATE_TASK': 'badge-info',
      'DELETE_TASK': 'badge-warning',
      'CHANGE_ROLE': 'badge-purple',
      'HTTP_ERROR': 'badge-warning',
      'INTERNAL_ERROR': 'badge-danger',
    };
    return map[errorCode] || 'badge-default';
  }

  /**
   * Devuelve la clase CSS según el statusCode HTTP (severidad).
   */
  getSeverityClass(statusCode: number): string {
    if (statusCode >= 500) return 'severity-critical';
    if (statusCode >= 400) return 'severity-warning';
    return 'severity-ok';
  }

  /**
   * Etiqueta legible del tipo de evento.
   */
  getEventLabel(errorCode: string): string {
    return this.eventTypes.find(e => e.value === errorCode)?.label ?? errorCode;
  }
}
