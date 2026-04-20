import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado que rechaza cadenas compuestas únicamente de espacios en blanco.
 * Previene el envío de datos como "   " que pasan la validación de longitud mínima
 * pero no contienen información significativa (buena práctica de seguridad).
 *
 * Uso: Validators.compose([Validators.required, noWhitespaceValidator()])
 */
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // Solo valida si hay un valor (evitar conflicto con Validators.required)
    if (value && typeof value === 'string' && value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  };
}
