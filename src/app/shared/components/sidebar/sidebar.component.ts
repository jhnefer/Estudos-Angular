import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RippleModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Usuários', icon: 'pi pi-users', routerLink: '/users' },
    { label: 'Clientes', icon: 'pi pi-address-book', routerLink: '/customers' },
    { label: 'Fornecedores', icon: 'pi pi-truck', routerLink: '/suppliers' },
    { label: 'Produtos', icon: 'pi pi-box', routerLink: '/products' }
  ];
}
