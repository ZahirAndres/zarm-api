import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar [userRole]="null" [userName]="''" />
    <main class="dashboard-main">
      <router-outlet />
    </main>
  `,
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {}
