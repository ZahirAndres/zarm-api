import { Component, OnInit, inject, signal } from '@angular/core';
import { PlayersService, User } from '../../core/services/players.service';

@Component({
  selector: 'app-players',
  standalone: true,
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
export class PlayersComponent implements OnInit {
  private usersService = inject(PlayersService);

  users = signal<User[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      }
    });
  }

  // Función para cambiar de Jugador a Entrenador y viceversa
  toggleRole(user: User) {
    const newRoleId = user.rol_id === 1 ? 2 : 1; // 1: Entrenador, 2: Jugador
    
    // Actualizamos en BD
    this.usersService.updateUserRole(user.id, newRoleId).subscribe({
      next: () => {
        // Actualizamos UI instantáneamente con Signals
        this.users.update(currentUsers => 
          currentUsers.map(u => u.id === user.id ? { ...u, rol_id: newRoleId } : u)
        );
      }
    });
  }
}