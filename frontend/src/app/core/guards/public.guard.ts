import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  
  if (token) {
    // Si ya tienes sesión, la portada y el login son innecesarios
    return router.createUrlTree(['/dashboard']);
  }
  
  return true;
};
