import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, TableModule, InputTextModule, DialogModule, ButtonModule, MessageModule, SelectModule, IconField, InputIcon],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  searchControl = new FormControl('');
  
  userForm = this.fb.nonNullable.group({
    id: [0],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['operador' as AppUser['role'], Validators.required],
    status: ['ativo' as AppUser['status'], Validators.required],
    password: ['']
  });
  
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

  roleLabels = roleLabels;

  get filteredUsers() {
    const searchTerm = (this.searchControl.value || '').toLowerCase();
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
    this.userForm.reset({
      id: 0,
      role: 'operador',
      status: 'ativo',
      password: ''
    });
    
    // Para novos usuários, senha é obrigatória
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  openEditUser(user: AppUser) {
    this.editingUser.set(user);
    this.userForm.patchValue({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });

    // Para edição, senha é opcional
    this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();

    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos corretamente.');
      this.userForm.markAllAsTouched();
      return;
    }

    const userData = this.userForm.getRawValue();
    const isNewUser = !this.editingUser();

    this.errorMessage.set(null);

    if (!isNewUser) {
      this.userService.updateUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        lastLogin: this.editingUser()!.lastLogin
      });
    } else {
      const nextId = Math.max(...this.allUsers().map(u => u.id), 0) + 1;
      this.userService.addUser({
        id: nextId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
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
    this.userForm.reset();
  }
}
