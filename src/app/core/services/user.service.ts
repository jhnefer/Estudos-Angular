import { Injectable, signal } from '@angular/core';
import { AppUser } from '../../shared/models/user.model';

const initialUsers: AppUser[] = [
  { id: 1, name: 'Admin Sistema', email: 'admin@shipstock.com', role: 'admin', status: 'ativo', lastLogin: '2026-04-06 09:30' },
  { id: 2, name: 'Carlos Mendes', email: 'carlos@shipstock.com', role: 'operador', status: 'ativo', lastLogin: '2026-04-06 08:15' },
  { id: 3, name: 'Ana Souza', email: 'ana@shipstock.com', role: 'operador', status: 'ativo', lastLogin: '2026-04-05 17:45' },
  { id: 4, name: 'Roberto Lima', email: 'roberto@shipstock.com', role: 'visualizador', status: 'inativo', lastLogin: '2026-03-20 14:00' },
  { id: 5, name: 'Fernanda Costa', email: 'fernanda@shipstock.com', role: 'visualizador', status: 'ativo', lastLogin: '2026-04-04 11:30' },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _users = signal<AppUser[]>(initialUsers);
  readonly users = this._users.asReadonly();

  getUsers() {
    return this._users();
  }

  addUser(user: AppUser) {
    this._users.update(users => [...users, user]);
  }

  updateUser(user: AppUser) {
    this._users.update(users => users.map(item => (item.id === user.id ? user : item)));
  }

  deleteUser(id: number) {
    this._users.update(users => users.filter(user => user.id !== id));
  }
}
