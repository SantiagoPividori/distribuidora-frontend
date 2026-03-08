import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token-service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
  });

  errorMsg = signal<string | null>(null);
  submit(): void {
    if (this.form.invalid) return;

    this.errorMsg.set(null);
    const payload = this.form.getRawValue();

    this.authService.login(payload).subscribe({
      next: (res) => {
        //Guardar tokens via TokenService
        this.tokenService.setToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);

        //Redirigir al flujo de ventas
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Login FAIL', err);
        if (err.status === 401 || err.status === 403) {
          this.errorMsg.set('Usuario o contraseña incorrectos');
        } else {
          this.errorMsg.set('Error de conexión. Intenta de nuevo.');
        }
      },
    });
  }
}
