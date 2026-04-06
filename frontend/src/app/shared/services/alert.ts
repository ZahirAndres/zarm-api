import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private swalCustom = Swal.mixin({
    background: 'var(--color-surface)', // Fondo oscuro
    color: 'var(--color-text)',
    customClass: {
      popup: 'card',
      actions: 'flex gap-md',
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-ghost',
      denyButton: 'btn btn-danger'
    },
    buttonsStyling: false               // Apagamos botones por defecto
  });

  // Toast de Éxito
  success(message: string) {
    this.swalCustom.fire({
      icon: 'success',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      iconColor: 'var(--color-success)'
    });
  }

  // Alerta de Error
  error(title: string, message: string) {
    this.swalCustom.fire({
      icon: 'error',
      title: title,
      text: message,
      iconColor: 'var(--color-danger)'
    });
  }

  // Alerta de Advertencia
  warning(title: string, message: string) {
    this.swalCustom.fire({
      icon: 'warning',
      title: title,
      text: message,
      iconColor: 'var(--color-warning)'
    });
  }

  // 4. Modal de Confirmación
  // Retorna una Promesa para saber lo que dijo el usuario
  confirm(title: string, text: string) {
    return this.swalCustom.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      iconColor: 'var(--color-primary)',
    });
  }
}