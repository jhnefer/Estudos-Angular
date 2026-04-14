import { Routes } from '@angular/router';
import { authGuard } from '../guards';

export const routes: Routes = [
    {
      path: 'login',
      loadComponent: () => import('../../features/auth/login.component').then(m => m.LoginComponent)
    },
    {
      path: 'usuarios',
      canActivate: [authGuard],
      loadComponent: () => import('../../features/users/users.component').then(m => m.UsersComponent)
    },
    {
      path: 'clientes',
      canActivate: [authGuard],
      loadComponent: () => import('../../features/customers/customers.component').then(m => m.CustomersComponent)
    },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    }
];
