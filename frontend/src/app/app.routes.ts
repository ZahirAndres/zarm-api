import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/dashboard/home.component').then(m => m.HomeComponent)
  },

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
        canActivate: [roleGuard],
        data: { expectedRoleId: 1, expectedRoleName: 'Entrenador' },
        loadComponent: () =>
          import('./features/players/players.component').then(m => m.PlayersComponent)
      },
      {
        // Módulo de Auditoría: solo accesible para Admin (Entrenador, rol_id=1)
        path: 'logs',
        canActivate: [roleGuard],
        data: { expectedRoleId: 1, expectedRoleName: 'Entrenador' },
        loadComponent: () =>
          import('./features/logs/logs.component').then(m => m.LogsComponent)
      },
    ]
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
