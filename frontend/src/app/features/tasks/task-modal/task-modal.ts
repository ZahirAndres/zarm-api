import { Component, EventEmitter, Output, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TasksService } from '../../../core/services/tasks.service';

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

  taskForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
    priority: [false],
    user_id: [null, Validators.required]
  });

  // ¡AQUÍ ESTÁN LAS VARIABLES QUE FALTABAN!
  isLoading = false;
  errorMsg = '';
  // Jugadores de prueba (Luego los traeremos de la BD)
  players = [
    { id: 2, username: 'Jugador 1' },
    { id: 3, username: 'Jugador 2' }
  ];

  ngOnInit() {
    // Si recibimos datos, llenamos el formulario para editar
    if (this.taskToEdit) {
      this.taskForm.patchValue({
        name: this.taskToEdit.name,
        description: this.taskToEdit.description,
        priority: this.taskToEdit.priority,
        user_id: this.taskToEdit.user_id
      });
    }
  }

  // ¡FUNCIÓN PARA CERRAR!
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
      // MODO EDICIÓN
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
      // MODO CREACIÓN
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