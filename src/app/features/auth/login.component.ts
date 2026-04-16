import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  public readonly authService = inject(AuthService);

  handleLogin() {
    this.authService.login();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/users']);
    }
  }

  handleLogout() {
    this.authService.logout();
  }
}
