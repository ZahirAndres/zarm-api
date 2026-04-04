import { Component, OnInit, Query, computed, inject, signal } from '@angular/core';
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
  searchQuery = signal<string>(''); // filtro
  viewMode = signal<'grid' | 'table'>('grid'); // vista

  filteredUsers = computed(()=>{
    const query = this.searchQuery().toLowerCase();
    if(!query) return this.users();

    return this.users().filter(user => 
      user.username?.toLowerCase().includes(query) ||
      user.name?.toLowerCase().includes(query) ||
      user.lastname?.toLowerCase().includes(query)
    );
  });

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

  // Filtro 
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  setViewMode(mode: 'grid' | 'table') {
    this.viewMode.set(mode);
  }

  // Función para cambiar de Jugador a Entrenador y viceversa
  toggleRole(user: User) {
    const newRoleId = user.rol_id === 1 ? 2 : 1; // 1: Entrenador, 2: Jugador
    this.usersService.updateUserRole(user.id, newRoleId).subscribe({
      next: () => {
        this.users.update(currentUsers => 
          currentUsers.map(u => u.id === user.id ? { ...u, rol_id: newRoleId } : u)
        );
      }
    });
  }
}