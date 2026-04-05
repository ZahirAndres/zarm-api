import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // Se envía y se manejan errores
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Manejo de error de ThrottlerModule (Peticiones rápidas)
      if (error.status === 429) {
        alert('🚦 ¡Wow, vas muy rápido! Has excedido el límite de acciones. Por favor, espera unos segundos e intenta de nuevo.');
      }

      // Token expirado
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh-token') && !req.url.includes('/logout')) {
        
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((res) => {
              isRefreshing = false; 
              refreshTokenSubject.next(res.accessToken); 
              
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.accessToken}` }
              });
              return next(newReq);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(t => t != null),
            take(1),
            switchMap(jwt => {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${jwt}` }
              });
              return next(retryReq);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};