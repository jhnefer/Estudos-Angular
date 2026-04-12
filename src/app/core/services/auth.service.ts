import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  login() {
    this._isLoggedIn.set(true);
  }

  logout() {
    this._isLoggedIn.set(false);
  }

  isAuthenticated(): boolean {
    return this._isLoggedIn();
  }
}
