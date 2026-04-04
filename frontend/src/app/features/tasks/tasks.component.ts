import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common'; // Agregamos DatePipe
import { TasksService, Task } from '../../core/services/tasks.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskModalComponent } from './task-modal/task-modal';

@Component({
  selector: 'app-tasks',
  standalone: true,
  // DatePipe nos ayuda a formatear la fecha de creación fácilmente
  imports: [AsyncPipe, DatePipe, TaskModalComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  public authService = inject(AuthService);

  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(true);
  isModalOpen = signal<boolean>(false);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading.set(true); // Iniciamos carga
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data.sort((a, b) => b.id - a.id));
        this.isLoading.set(false); // Finalizamos carga
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Métodos simples para el modal usando signals
  openModal() { this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); }

  // --- Lógica de Eliminar ---
  deleteTask(id: number) {
    if (confirm('¿Eliminar ejercicio?')) {
      this.tasksService.deleteTask(id).subscribe({
        next: () => {
          // ACTUALIZACIÓN REACTIVA: Filtramos el signal directamente
          this.tasks.update(prevTasks => prevTasks.filter(t => t.id !== id));
        }
      });
    }
  }
}