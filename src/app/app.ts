import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from './components/shared/bottom-nav/bottom-nav.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('distribuidora-frontend');
  private readonly router = inject(Router);

  showNav = false;

  private readonly hiddenRoutes = ['/auth/login', '/products', '/summary'];

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showNav = !this.hiddenRoutes.some(r => e.urlAfterRedirects.startsWith(r));
      });
  }
}