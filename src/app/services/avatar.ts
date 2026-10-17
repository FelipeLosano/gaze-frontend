// src/app/services/avatar.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private http = inject(HttpClient);

  // POST /me/avatar  (multipart)
  upload(file: File): Observable<void> {
    const form = new FormData();
    form.append('file', file); // "file" must match @RequestParam("file")
    return this.http.post<void>(`/api/me/avatar`, form);
  }

  // Option A: just give the URL to an <img>
  avatarUrl(userId: string): string {
    return `/api/users/${userId}/avatar`;
  }
}
