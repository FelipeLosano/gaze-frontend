import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth';

interface Me {
  id: string;
  username: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  me = signal<Me | null>(null);
  userMenuOpen = signal(false);

  constructor() {
    this.http.get<Me>('/api/me').subscribe((user) => this.me.set(user));
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }
    return !!token;
  }

  path(): string {
    return window.location.pathname;
  }

  toggleUserMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.userMenuOpen.update((isOpen) => !isOpen);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeUserMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeUserMenu();
  }

  logout(): void {
    this.closeUserMenu();
    this.auth.logout();
  }
}
