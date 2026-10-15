import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isAuthEndpoint = req.url.startsWith('/api/auth/');

  // Requests are immutable, so we clone to add the header
  const authReq =
    auth.token && !isAuthEndpoint
      ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } })
      : req;

  return next(authReq).pipe(
    catchError((err) => {
      // Token expired or invalid → log out
      if (err.status === 401 && !isAuthEndpoint) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
