import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AuthModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showAuthModal = false;
  authMode: 'login' | 'register' = 'login';

  openModal(mode: 'login' | 'register') {
    this.authMode = mode;
    this.showAuthModal = true;
  }

  closeModal() {
    this.showAuthModal = false;
  }
}
