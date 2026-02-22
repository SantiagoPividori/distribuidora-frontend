import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from "../../../core/service/auth.service";

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})

export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  //Usamos FormBuilder para hacer formularios, de esta forma el HTML lo enlazamos a esto para hacer validaciones y demás.
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]]
  });

  //Acá vemos que hacer en los distintos escenarios cuando el usuario oprime el login y hace submit.
  submit(): void {
    debugger;
    if (this.form.invalid) {
      console.log('Form inválido -> saliendo');
      return;
    }

    const payload = this.form.getRawValue();

    this.authService.login(payload).subscribe({
      next: (res) => {
        console.log('Login OK', res)

        // 1. Guardamos el token para que el Interceptor lo use
      // Asegúrate de usar el nombre de propiedad exacto que devuelve tu Backend (ej: accessToken)
      localStorage.setItem('accessToken', res.accessToken);

      // 2. Redireccionamos al Dashboard
      this.router.navigate(['/user/dashboard']);
      }, 
      error: (err) => {
        console.log('Login FAIL', err)
      },
    })
  } 
}
