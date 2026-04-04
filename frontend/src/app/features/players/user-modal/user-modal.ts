import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PlayersService, User } from '../../../core/services/players.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
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

  userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required]]
  });
  
  ngOnInit() {
    if (this.userToEdit) {
      this.userForm.patchValue(this.userToEdit);
    }
  }

  onSubmit() {
    if (this.userForm.invalid || !this.userToEdit) return;

    this.usersService.updateUser(this.userToEdit.id, this.userForm.value as Partial<User>).subscribe({
      next: () => {
        this.userSaved.emit();
        this.close.emit();
      }
    });
  }
}
