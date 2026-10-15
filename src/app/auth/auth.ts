import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // A signal holding the current token (or null if logged out)
  private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  // A computed value that updates automatically when tokenSignal changes
  readonly isLoggedIn = computed(() => this.tokenSignal() !== null);

  get token(): string | null {
    return this.tokenSignal();
  }

  login(email: string, password: string) {
    return this.http.post<TokenResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        this.tokenSignal.set(res.accessToken);
      }),
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
    this.router.navigateByUrl('/login');
  }
}
