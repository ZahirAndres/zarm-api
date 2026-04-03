import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // Clonamos la solicitud original y le pegamos el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // Continuamos con el flujo pero también "interceptamos" en caso de que el Token sea inválido (Status 401/403)
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el Backend escupe a nuestro usuario por falta de permisos o caducidad
      if (error.status === 401 || error.status === 403) {
        // En una app real de Phase 9, intentaríamos el "Refresh Token"
        // Pero por ahora, simplemente lo obligamos a Log In otra vez
        localStorage.removeItem('access_token');
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};
