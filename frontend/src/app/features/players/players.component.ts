import { Component, OnInit, Query, computed, inject, signal } from '@angular/core';
import { PlayersService, User } from '../../core/services/players.service';
import { AsyncPipe } from '@angular/common';
import { UserModalComponent } from './user-modal/user-modal';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../shared/services/alert';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [UserModalComponent, AsyncPipe],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
export class PlayersComponent implements OnInit {
  public authService = inject(AuthService);
  private usersService = inject(PlayersService);
  private alertService = inject(AlertService);

  users = signal<User[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>(''); // filtro
  viewMode = signal<'grid' | 'table'>('grid'); // vista
  isModalOpen = signal<boolean>(false);
  selectedUser = signal<User | null>(null);


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

  // Editar
  openEditModal(user: User) {
    this.selectedUser.set(user); // Guardamos qué usuario queremos editar
    this.isModalOpen.set(true);  // Abrimos el modal
  }

  // Función para cerrarlo
  closeModal() {
    this.isModalOpen.set(false);
    this.selectedUser.set(null);
  }

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.users();

    return this.users().filter(user =>
      user.username?.toLowerCase().includes(query) ||
      user.name?.toLowerCase().includes(query) ||
      user.lastname?.toLowerCase().includes(query)
    );
  });

  // Eliminar
  deleteUser(id: number) {
    this.alertService.confirm(
      '¿Eliminar usuario?',
      'Esta acción es permanente y no se puede deshacer.'
    ).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(id).subscribe({
          next: () => {
            this.users.update(prev => prev.filter(u => u.id !== id));
            this.alertService.success('Usuario eliminado de la plantilla');
          },
          error: (err) => {
            this.alertService.error('Error al eliminar', 'Hubo un problema al conectar con el servidor.');
          }
        });
      }
    });
  }
}