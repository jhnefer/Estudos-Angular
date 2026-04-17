import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
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
  public userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);

  searchControl = new FormControl('');
  
  private searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith('')),
    { initialValue: '' }
  );

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

  filteredUsers = computed(() => {
    const term = (this.searchTerm() || '').toLowerCase();
    const users = this.userService.users();
    return term
      ? users.filter(u =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
        )
      : users;
  });

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
      const nextId = Math.max(...this.userService.users().map(u => u.id), 0) + 1;
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
    this.confirmationService.confirm({
      message: `Deseja realmente excluir ${user.name}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.userService.deleteUser(user.id);
      }
    });
  }

  closeDialog() {
    this.dialogOpen = false;
    this.editingUser.set(null);
    this.errorMessage.set(null);
    this.userForm.reset();
  }
}
