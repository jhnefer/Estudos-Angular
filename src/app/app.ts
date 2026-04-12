import { Component, signal } from '@angular/core';
import { UsersComponent } from './users.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UsersComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projeto-angular');
}
