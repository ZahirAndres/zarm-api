import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-bg">
        <div class="auth-orb orb-1"></div>
        <div class="auth-orb orb-2"></div>
        <div class="court-lines"></div>
      </div>
      <div class="auth-card fade-in">
        <div class="auth-brand">
          <span class="auth-logo">🏀</span>
          <h1 class="auth-title">CoachZone</h1>
          <p class="auth-subtitle text-muted">Gestión de Entrenamiento</p>
        </div>
        <router-outlet />
      </div>
    </div>
  `,
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {}
