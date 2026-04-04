import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const expectedRoleId = route.data['expectedRoleId']; 
  const expectedRoleName = route.data['expectedRoleName']; 

  const token = localStorage.getItem('access_token');

  if (!token) {
    return router.createUrlTree(['/']);
  }

  try {
    const decoded: any = jwtDecode(token);
    
    // Verificamos si el usuario cumple con el rol_id o el nombre del rol
    if (decoded.rol_id === expectedRoleId || decoded.role === expectedRoleName) {
      return true; 
    }

    // Si es un jugador intentando entrar a zona de entrenadores, lo rebotamos al dashboard
    return router.createUrlTree(['/dashboard']);
    
  } catch (error) {
    // Si el token está corrupto, lo mandamos afuera
    return router.createUrlTree(['/']);
  }
};