import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clients/pages/client-list/client-list.component').then(
        (m) => m.ClientListComponent,
      ),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/order-list/order-list.component').then(
        (m) => m.OrderListComponent,
      ),
  },
  {
    path: 'summary',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/order-summary/order-summary.component').then(
        (m) => m.OrderSummaryComponent,
      ),
  },
  {
    path: 'orders/client/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/order-list/order-list.component').then(
        (m) => m.OrderListComponent,
      ),
  },

  {
    path: 'orders/:orderId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/order-detail/order-detail.component').then(
        (m) => m.OrderDetailComponent,
      ),
  },

  //Redirects
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: '**', redirectTo: 'auth/login' },
];
