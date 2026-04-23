import { Injectable, signal, computed } from '@angular/core';
import { AppUser } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AppUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this._currentUser());

  login() {
    // Simulação de login bem-sucedido
    const mockUser: AppUser = {
      id: 1,
      name: 'Usuário Administrativo',
      email: 'admin@navistock.com',
      role: 'admin',
      status: 'ativo',
      lastLogin: new Date().toISOString()
    };
    this._currentUser.set(mockUser);
    return true;
  }

  logout() {
    this._currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}
