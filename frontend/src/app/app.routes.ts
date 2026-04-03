import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [

  // ── Portada Libre (Aquí vivirá el Auth Modal) ───────────────
  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/dashboard/home.component').then(m => m.HomeComponent)
  },

  // ── Rutas del dashboard (Con Navbar y contenido principal) ───────────────
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
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
