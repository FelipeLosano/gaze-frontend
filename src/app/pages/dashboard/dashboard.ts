import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth';

interface Me {
  email: string;
  roles: string[];
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  me = signal<Me | null>(null);

  constructor() {
    this.http.get<Me>('/api/me').subscribe((user) => this.me.set(user));
  }

  logout() {
    this.auth.logout();
  }
}
