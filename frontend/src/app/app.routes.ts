import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [

  // ── Portada Libre (Toma toda la pantalla, fuera de layouts) ───────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/home.component').then(m => m.HomeComponent)
  },

  // ── Rutas de autenticación (Tarjeta centrada) ──────────
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
    ]
  },

  // ── Rutas del dashboard (Con Navbar y contenido principal) ───────────────
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/tasks.component').then(m => m.TasksComponent)
      },
      {
        // Renombrado de 'players' a 'users' adaptándonos al Backend
        path: 'users',
        loadComponent: () =>
          import('./features/players/players.component').then(m => m.PlayersComponent)
      },
    ]
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
