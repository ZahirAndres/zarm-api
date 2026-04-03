import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-wrap fade-in">
      <div class="home-hero">
        <span class="home-ball">🏀</span>
        <h1 class="home-title">Bienvenido a <span class="gradient-text">CoachZone</span></h1>
        <p class="home-sub text-muted">La plataforma profesional de gestión de entrenamientos de baloncesto</p>
        <div class="home-actions">
          <a routerLink="/login" class="btn btn-primary btn-lg">Iniciar Sesión</a>
          <a routerLink="/register" class="btn btn-ghost btn-lg">Registrarse</a>
        </div>
      </div>

      <div class="home-cards">
        <div class="card feature-card">
          <span class="feature-icon">📋</span>
          <h3>Gestión de Ejercicios</h3>
          <p class="text-muted text-sm">Crea y asigna ejercicios de entrenamiento personalizados a cada jugador.</p>
        </div>
        <div class="card feature-card">
          <span class="feature-icon">👥</span>
          <h3>Control de Plantilla</h3>
          <p class="text-muted text-sm">Administra todo tu equipo desde un solo panel, con roles diferenciados.</p>
        </div>
        <div class="card feature-card">
          <span class="feature-icon">📊</span>
          <h3>Seguimiento en Tiempo Real</h3>
          <p class="text-muted text-sm">Monitorea el progreso de cada jugador con métricas claras.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-wrap {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      gap: var(--space-2xl);
      background: var(--color-bg);
    }
    .home-hero {
      text-align: center;
      max-width: 600px;
    }
    .home-ball {
      font-size: 80px;
      display: block;
      margin-bottom: var(--space-lg);
      animation: bounce 2s ease-in-out infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-12px); }
    }
    .home-title {
      font-size: var(--font-size-3xl);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: var(--space-md);
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .home-sub {
      font-size: var(--font-size-lg);
      margin-bottom: var(--space-xl);
      line-height: 1.5;
    }
    .home-actions {
      display: flex;
      gap: var(--space-md);
      justify-content: center;
      flex-wrap: wrap;
    }
    .home-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
      width: 100%;
      max-width: 900px;
    }
    .feature-card {
      text-align: center;
      padding: var(--space-xl);
      transition: transform var(--transition), box-shadow var(--transition);
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-primary);
    }
    .feature-icon { font-size: 40px; display: block; margin-bottom: var(--space-md); }
    .feature-card h3 { font-size: var(--font-size-lg); margin-bottom: var(--space-sm); }
  `]
})
export class HomeComponent {}
