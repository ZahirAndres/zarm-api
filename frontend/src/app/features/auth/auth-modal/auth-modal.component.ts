import { Component, EventEmitter, Output, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent implements OnInit {
  @Input() initialMode: 'login' | 'register' = 'login';
  @Output() close = new EventEmitter<void>();
  
  // Controla qué panel se muestra ('login' o 'register')
  activeMode: 'login' | 'register' = 'login';
  
  ngOnInit() {
    this.activeMode = this.initialMode;
  }
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Formularios
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isLoading = false;
  loginError = '';
  registerError = '';

  toggleMode(mode: 'login' | 'register') {
    this.activeMode = mode;
    this.loginError = '';
    this.registerError = '';
  }

  onClose() {
    this.close.emit();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.loginError = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.accessToken) {
          this.router.navigate(['/dashboard']);
          this.onClose();
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.loginError = 'Usuario o contraseña incorrectos.';
        } else {
          this.loginError = 'Error de conexión.';
        }
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.registerError = '';
    
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // Si el registro fue exitoso, llenamos el form de login con el usuario creado y giramos
        this.loginForm.patchValue({ username: this.registerForm.value.username, password: '' });
        this.toggleMode('login');
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.registerError = 'Ese nombre de usuario ya está en uso.';
        } else {
          this.registerError = 'Ocurrió un error al crear la cuenta.';
        }
      }
    });
  }
}
