import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common'; 
import { TasksService, Task } from '../../core/services/tasks.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskModalComponent } from './task-modal/task-modal';
import { AlertService } from '../../shared/services/alert';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TaskModalComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  public authService = inject(AuthService);
  public alertService = inject(AlertService);

  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(true);
  isModalOpen = signal<boolean>(false);
  selectedTask = signal<Task | null>(null);
  searchQuery = signal<string>('');
  viewMode = signal<'grid' | 'table'>('grid');

  filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.tasks();

    return this.tasks().filter(task =>
      task.name?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading.set(true);
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data.sort((a, b) => b.id - a.id));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading.set(false);
      }
    });
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  setViewMode(mode: 'grid' | 'table') {
    this.viewMode.set(mode);
  }

  // abrir en modo creación
  openCreateModal() {
    this.selectedTask.set(null);
    this.isModalOpen.set(true);
  }

  //abrir en modo edición
  openEditModal(task: Task) {
    this.selectedTask.set(task);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedTask.set(null);
  }

  // --- Lógica de Eliminar ---
  deleteTask(id: number) {
    this.alertService.confirm(
      '¿Eliminar tarea?',
      'Esta acción es permanente y no se puede deshacer.'
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.tasksService.deleteTask(id).subscribe({
          next: () => {
            this.tasks.update(prevTasks => prevTasks.filter(t => t.id !== id));
            this.alertService.success('Tarea eliminada correctamente');
          },
          error: (err) => {
            this.alertService.error('Error al eliminar', err.message);
          }
        });
      }
    });
  }
}