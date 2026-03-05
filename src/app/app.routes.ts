import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "auth/login", loadComponent: () => import('./features/auth/login-page/login-page').then(m => m.LoginPage) },
    { path: "auth/register", loadComponent: () => import('./features/auth/register-page/register-page').then(m => m.RegisterPage) },
    { path: 'user/dashboard', loadComponent: () => import('./features/users/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)},
    { path: '', pathMatch: 'full', redirectTo: "auth/login" }
];
