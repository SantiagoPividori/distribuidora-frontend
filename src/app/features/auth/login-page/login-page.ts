import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "../../../core/services/auth.service";
import { TokenService } from "../../../core/services/token-service";

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private fb           = inject(FormBuilder);
  private authService  = inject(AuthService);
  private tokenService = inject(TokenService);
  private router       = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]]
  });

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();

    this.authService.login(payload).subscribe({
      next: (res) => {
        // ── Guardar tokens via TokenService ──────────
        this.tokenService.setToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);

        // ── Redirigir al flujo de ventas ─────────────
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Login FAIL', err);
      },
    });
  }
}