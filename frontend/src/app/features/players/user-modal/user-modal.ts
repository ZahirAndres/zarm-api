import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PlayersService, User } from '../../../core/services/players.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert';

@Component({
  selector: 'app-user-modal',
  standalone: true, 
  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.css',
})
export class UserModalComponent implements OnInit {
  @Input() userToEdit: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() userSaved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private usersService = inject(PlayersService);
  private alertService = inject(AlertService); 

  isLoading = false; 

  userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]]
  });
  
  ngOnInit() {
    if (this.userToEdit) {
      this.userForm.patchValue(this.userToEdit);
    }
  }

  onSubmit() {
    if (this.userForm.invalid || !this.userToEdit) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.usersService.updateUser(this.userToEdit.id, this.userForm.value as Partial<User>).subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.success('Usuario actualizado correctamente'); 
        this.userSaved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.alertService.error('Error', 'No se pudieron guardar los cambios.'); 
        console.error(err);
      }
    });
  }
}