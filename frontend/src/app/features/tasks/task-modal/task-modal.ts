import { Component, EventEmitter, Output, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TasksService } from '../../../core/services/tasks.service';
import { PlayersService, User } from '../../../core/services/players.service'; 

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css'
})
export class TaskModalComponent implements OnInit {
  @Input() taskToEdit: Task | null = null; 
  @Output() close = new EventEmitter<void>();
  @Output() taskSaved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tasksService = inject(TasksService);
  private playersService = inject(PlayersService); 

  taskForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
    priority: [false],
    user_id: [null, Validators.required]
  });

  isLoading = false;
  errorMsg = '';
  players: User[] = [];

  ngOnInit() {
    this.playersService.getUsers().subscribe({
      next: (users) => {
        this.players = users.filter(u => u.rol_id === 2);
      },
      error: (err) => {
        console.error('Error al cargar la lista de jugadores', err);
        this.errorMsg = 'No se pudieron cargar los jugadores.';
      }
    });

    if (this.taskToEdit) {
      this.taskForm.patchValue({
        name: this.taskToEdit.name,
        description: this.taskToEdit.description,
        priority: this.taskToEdit.priority,
        user_id: this.taskToEdit.user_id
      });
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    const taskData = { 
      ...this.taskForm.value, 
      user_id: Number(this.taskForm.value.user_id) 
    };

    if (this.taskToEdit) {
      this.tasksService.updateTask(this.taskToEdit.id, taskData).subscribe({
        next: () => {
          this.isLoading = false;
          this.taskSaved.emit();
          this.close.emit();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = 'Ocurrió un error al actualizar.';
          console.error(err);
        }
      });
    } else {
      this.tasksService.createTask(taskData).subscribe({
        next: () => {
          this.isLoading = false;
          this.taskSaved.emit();
          this.close.emit();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = 'Ocurrió un error al crear.';
          console.error(err);
        }
      });
    }
  }
}