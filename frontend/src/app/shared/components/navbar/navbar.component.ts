import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() userRole: 'Entrenador' | 'Jugador' | null = null;
  @Input() userName: string = '';

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
