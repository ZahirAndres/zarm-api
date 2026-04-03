import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificamos si existe el token guardado
  const token = localStorage.getItem('access_token');
  
  if (token) {
    return true;
  }
  
  // Si no hay token, lo mandamos a la portada
  return router.createUrlTree(['/']);
};
