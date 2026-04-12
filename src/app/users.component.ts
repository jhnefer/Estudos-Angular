import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

type AppUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operador' | 'visualizador';
  status: 'ativo' | 'inativo';
  lastLogin: string;
};

const initialUsers: AppUser[] = [
  { id: 1, name: 'Admin Sistema', email: 'admin@shipstock.com', role: 'admin', status: 'ativo', lastLogin: '2026-04-06 09:30' },
  { id: 2, name: 'Carlos Mendes', email: 'carlos@shipstock.com', role: 'operador', status: 'ativo', lastLogin: '2026-04-06 08:15' },
  { id: 3, name: 'Ana Souza', email: 'ana@shipstock.com', role: 'operador', status: 'ativo', lastLogin: '2026-04-05 17:45' },
  { id: 4, name: 'Roberto Lima', email: 'roberto@shipstock.com', role: 'visualizador', status: 'inativo', lastLogin: '2026-03-20 14:00' },
  { id: 5, name: 'Fernanda Costa', email: 'fernanda@shipstock.com', role: 'visualizador', status: 'ativo', lastLogin: '2026-04-04 11:30' },
];

const roleLabels = {
  admin: { label: 'Admin', icon: 'pi-shield-fill', color: 'text-primary' },
  operador: { label: 'Operador', icon: 'pi-shield', color: 'text-info' },
  visualizador: { label: 'Visualizador', icon: 'pi-user', color: 'text-muted-foreground' },
};

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, DialogModule, ButtonModule, MessageModule, SelectModule, IconField, InputIcon],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  search = '';
  dialogOpen = false;
  allUsers = signal(initialUsers);
  editingUser = signal<AppUser | null>(null);
  errorMessage = signal<string | null>(null);

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Operador', value: 'operador' },
    { label: 'Visualizador', value: 'visualizador' }
  ];

  statuses = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' }
  ];

  form = {
    id: 0,
    name: '',
    email: '',
    role: 'operador' as AppUser['role'],
    status: 'ativo' as AppUser['status'],
    password: ''
  };

  roleLabels = roleLabels;

  get filteredUsers() {
    const searchTerm = this.search.toLowerCase();
    return searchTerm
      ? this.allUsers().filter(u =>
          u.name.toLowerCase().includes(searchTerm) ||
          u.email.toLowerCase().includes(searchTerm)
        )
      : this.allUsers();
  }

  get dialogTitle() {
    return this.editingUser() ? 'Editar Usuário' : 'Novo Usuário';
  }

  getRoleLabel(role: AppUser['role']) {
    return roleLabels[role] || roleLabels.visualizador;
  }

  openNewUser() {
    this.editingUser.set(null);
    this.form = {
      id: 0,
      name: '',
      email: '',
      role: 'operador',
      status: 'ativo',
      password: ''
    };
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  openEditUser(user: AppUser) {
    this.editingUser.set(user);
    this.form = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    };
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  saveUser() {
    const trimmedName = this.form.name.trim();
    const trimmedEmail = this.form.email.trim().toLowerCase();
    const isNewUser = !this.editingUser();

    // Validação de campos obrigatórios
    if (!trimmedName || !trimmedEmail) {
      this.errorMessage.set('Nome e e-mail são obrigatórios.');
      return;
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      this.errorMessage.set('Por favor, insira um e-mail válido.');
      return;
    }

    // Validação de senha
    if (isNewUser && (!this.form.password || this.form.password.length < 6)) {
      this.errorMessage.set('A senha deve ter pelo menos 6 caracteres para novos usuários.');
      return;
    }

    if (!isNewUser && this.form.password && this.form.password.length < 6) {
      this.errorMessage.set('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    this.errorMessage.set(null);

    if (this.editingUser()) {
      this.allUsers.update(users =>
        users.map(user =>
          user.id === this.form.id
            ? {
                ...user,
                name: trimmedName,
                email: trimmedEmail,
                role: this.form.role,
                status: this.form.status
              }
            : user
        )
      );
    } else {
      const nextId = Math.max(...this.allUsers().map(u => u.id), 0) + 1;
      this.allUsers.update(users => [
        ...users,
        {
          id: nextId,
          name: trimmedName,
          email: trimmedEmail,
          role: this.form.role,
          status: this.form.status,
          lastLogin: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        }
      ]);
    }

    this.closeDialog();
  }

  deleteUser(user: AppUser) {
    if (!window.confirm(`Deseja realmente excluir ${user.name}?`)) {
      return;
    }

    this.allUsers.update(users => users.filter(item => item.id !== user.id));
  }

  closeDialog() {
    this.dialogOpen = false;
    this.editingUser.set(null);
    this.errorMessage.set(null);
    this.form = {
      id: 0,
      name: '',
      email: '',
      role: 'operador',
      status: 'ativo',
      password: ''
    };
  }
}
