import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        {
          path: 'users',
          loadComponent: () => import('../../features/users/users.component').then(m => m.UsersComponent)
        },
        {
          path: 'customers',
          loadComponent: () => import('../../features/customers/customers.component').then(m => m.CustomersComponent)
        },
        {
          path: 'suppliers',
          loadComponent: () => import('../../features/suppliers/suppliers.component').then(m => m.SuppliersComponent)
        },
        {
          path: '',
          redirectTo: 'users',
          pathMatch: 'full'
        }
      ]
    },
    {
      path: '**',
      redirectTo: 'users'
    }
];
