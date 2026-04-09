import { Component, signal } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [Button],
  templateUrl: './button-demo.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projeto-angular');
}
