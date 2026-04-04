import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalComponent } from '../../../features/auth/auth-modal/auth-modal.component';
import { UserModalComponent } from '../../../features/players/user-modal/user-modal';
import { User } from '../../../core/services/players.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, AuthModalComponent, UserModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  menuOpen = false;
  isProfileModalOpen = signal<boolean>(false);
  currentUserData = signal<User | null>(null);

  isAuthModalOpen = false; 


  openProfileModal(userFromAuth: any) {
    // Transformamos los datos para que coincidan con la interfaz User
    const userToEdit: User = {
      id: userFromAuth.id,
      name: userFromAuth.name || '',
      lastname: userFromAuth.lastname || '',
      username: userFromAuth.username,
      rol_id: userFromAuth.rol_id
    };

    this.currentUserData.set(userToEdit);
    this.isProfileModalOpen.set(true);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openAuthModal() {
    this.isAuthModalOpen = true;
  }

  closeAuthModal() {
    this.isAuthModalOpen = false;
  }

  closeProfileModal() {
    this.isProfileModalOpen.set(false);
    this.currentUserData.set(null);
  }

  onProfileSaved() {
    alert('Perfil actualizado con éxito. Verás los cambios en tu próximo inicio de sesión.');
    this.closeProfileModal();
  }
}
