import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksService } from '../../../core/services/tasks.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css'
})
export class TaskModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tasksService = inject(TasksService);

  taskForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
    priority: [false, Validators.required],
    user_id: [null, Validators.required] 
  });

  isLoading = false;
  errorMsg = '';
  
  players = [
    { id: 2, username: 'Jugador 1' },
    { id: 3, username: 'Jugador 2' }
  ];

  ngOnInit() {}

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

    const payload = {
      ...this.taskForm.value,
      user_id: Number(this.taskForm.value.user_id)
    };

    this.tasksService.createTask(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.taskCreated.emit();
        this.onClose(); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Error al crear el ejercicio. Verifica los datos.';
        console.error(err);
      }
    });
  }
}