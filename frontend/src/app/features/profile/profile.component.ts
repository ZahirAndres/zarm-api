import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PlayersService } from '../../core/services/players.service';
import { AlertService } from '../../shared/services/alert';
import { noWhitespaceValidator } from '../../shared/validators/no-whitespace.validator';

/**
 * Componente de Perfil Propio.
 * 
 * Permite al usuario editar ÚNICAMENTE su propia información.
 * La prevención IDOR se aplica en dos niveles:
 * 1. Frontend: se usa el ID del token JWT para la petición (no hay campo editable).
 * 2. Backend: el endpoint PATCH /api/user/:id verifica session.id === id.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private playersService = inject(PlayersService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  currentUser = signal<any>(null);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^<>]*$/), noWhitespaceValidator()]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250), Validators.pattern(/^[^<>]*$/), noWhitespaceValidator()]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[^<>]*$/), noWhitespaceValidator()]],
  });

  ngOnInit() {
    this.isLoading.set(true);
    // Cargar datos del usuario desde el servidor (fuente de verdad)
    this.authService.getMe().subscribe({
      next: (profile) => {
        this.currentUser.set(profile);
        this.profileForm.patchValue({
          name: profile.name,
          lastname: profile.lastname,
          username: profile.username,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.alertService.error('Error', 'No se pudo cargar tu perfil.');
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser();
    if (!user?.id) return;

    this.isSaving.set(true);

    // Solo se envía el propio ID (IDOR prevention — no se expone ningún campo de ID editable)
    this.playersService.updateUser(user.id, this.profileForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.alertService.success('Perfil actualizado correctamente');
        // Refrescar token info en el cliente
        this.authService.getMe().subscribe();
      },
      error: (err) => {
        this.isSaving.set(false);
        if (err.status === 403) {
          this.alertService.error('Acceso denegado', 'No puedes modificar el perfil de otro usuario.');
        } else {
          this.alertService.error('Error', 'No se pudieron guardar los cambios.');
        }
      }
    });
  }

  /** Controles de acceso rápido a errores del formulario */
  get nameErrors() { return this.profileForm.get('name'); }
  get lastnameErrors() { return this.profileForm.get('lastname'); }
  get usernameErrors() { return this.profileForm.get('username'); }
}
