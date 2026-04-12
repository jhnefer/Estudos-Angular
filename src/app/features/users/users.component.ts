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
import { UserService } from '../../core/services';
import { AppUser } from '../../shared/models';

const roleLabels = {
  admin: { label: 'Admin', icon: 'pi-shield-fill', color: 'text-primary' },
  operador: { label: 'Operador', icon: 'pi-shield', color: 'text-info' },
  visualizador: { label: 'Visualizador', icon: 'pi-user', color: 'text-muted-foreground' },
};

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, DialogModule, ButtonModule, MessageModule, SelectModule, IconField, InputIcon],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  search = '';
  dialogOpen = false;
  editingUser = signal<AppUser | null>(null);
  errorMessage = signal<string | null>(null);

  get allUsers() {
    return this.userService.users;
  }

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

  constructor(private userService: UserService) {}

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
      this.userService.updateUser({
        id: this.form.id,
        name: trimmedName,
        email: trimmedEmail,
        role: this.form.role,
        status: this.form.status,
        lastLogin: this.editingUser()!.lastLogin
      });
    } else {
      const nextId = Math.max(...this.allUsers().map(u => u.id), 0) + 1;
      this.userService.addUser({
        id: nextId,
        name: trimmedName,
        email: trimmedEmail,
        role: this.form.role,
        status: this.form.status,
        lastLogin: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      });
    }

    this.closeDialog();
  }

  deleteUser(user: AppUser) {
    if (!window.confirm(`Deseja realmente excluir ${user.name}?`)) {
      return;
    }

    this.userService.deleteUser(user.id);
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
