import { Component, EventEmitter, Output, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TasksService } from '../../../core/services/tasks.service';
import { PlayersService, User } from '../../../core/services/players.service'; 
import { AlertService } from '../../../shared/services/alert';

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
  private alertService = inject(AlertService);

  taskForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[^<>]*$/)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^<>]*$/)]],
    priority: [false],
    user_id: [null, Validators.required]
  });

  isLoading = false;
  players: User[] = [];

  ngOnInit() {
    this.playersService.getUsers().subscribe({
      next: (users) => {
        this.players = users.filter(u => u.rol_id === 2);
      },
      error: (err) => {
        console.error('Error al cargar la lista de jugadores', err);
        this.alertService.error('Error al cargar la lista de jugadores', 'Hubo un problema de conexión con el servidor.');
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
    const taskData = { 
      ...this.taskForm.value, 
      user_id: Number(this.taskForm.value.user_id) 
    };

    const request$ = this.taskToEdit 
      ? this.tasksService.updateTask(this.taskToEdit.id, taskData)
      : this.tasksService.createTask(taskData);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.success(this.taskToEdit ? 'Ejercicio actualizado' : 'Ejercicio asignado');
        this.taskSaved.emit();
        this.close.emit();
      },
      error: () => {
        this.isLoading = false;
        this.alertService.error('Error al guardar', 'Hubo un problema de conexión con el servidor.');
        this.close.emit();
      }
    });
  }
}