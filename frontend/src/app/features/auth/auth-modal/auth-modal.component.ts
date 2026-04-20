import { Component, EventEmitter, Output, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../shared/services/alert';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace.validator';

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
  
  activeMode: 'login' | 'register' = 'login';
  
  ngOnInit() {
    this.activeMode = this.initialMode;
  }
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[^<>]*$/), noWhitespaceValidator()]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]]
  });

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^<>]*$/), noWhitespaceValidator()]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250), Validators.pattern(/^[^<>]*$/), noWhitespaceValidator()]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[^<>]*$/), noWhitespaceValidator()]],
    password: ['', [
      Validators.required, 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get passCriteria() {
    const p = this.registerForm.get('password')?.value || '';
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      num: /[0-9]/.test(p),
      special: /[\W_]/.test(p)
    };
  }

  get loginPassCriteria() {
  const p = this.loginForm.get('password')?.value || '';
  return {
    length: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    num: /[0-9]/.test(p),
    special: /[\W_]/.test(p)
  };
}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }
  
  isLoading = false;

  toggleMode(mode: 'login' | 'register') {
    this.activeMode = mode;
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
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.accessToken) {
          this.alertService.success('¡Bienvenido de vuelta!');
          this.router.navigate(['/dashboard']);
          this.onClose();
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.alertService.warning('Acceso denegado', 'Usuario o contraseña incorrectos.');
        } else {
          this.alertService.error('Error', 'Problema de conexión con el servidor.');
        }
        this.onClose();
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { confirmPassword, ...userData } = this.registerForm.value;
    
    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.success('¡Cuenta creada! Inicia sesión para continuar.');
        this.loginForm.patchValue({ username: this.registerForm.value.username, password: '' });
        this.toggleMode('login');
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.alertService.warning('Usuario duplicado', 'Ese nombre de usuario ya está en uso.');
          this.onClose();
        } else {
          this.alertService.error('Error', 'Ocurrió un error al crear la cuenta.');
        }
      }
    });
  }
}