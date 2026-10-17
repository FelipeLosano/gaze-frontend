import { Component, inject, input, signal } from '@angular/core';
import { AvatarService } from '../../services/avatar';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <img [src]="avatarSrc()" alt="Avatar" width="96" height="96" (error)="onImageError()" />

    <input type="file" accept="image/*" (change)="onFileSelected($event)" />

    <button (click)="upload()" [disabled]="!selectedFile() || uploading()">
      {{ uploading() ? 'Uploading...' : 'Upload' }}
    </button>

    @if (message()) {
      <p>{{ message() }}</p>
    }
  `,
})
export class AvatarComponent {
  private avatarService = inject(AvatarService);

  userId = input.required<string>(); // the UUID, passed from the parent

  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  message = signal('');
  private version = signal(Date.now()); // used to bust the cache

  avatarSrc() {
    return `${this.avatarService.avatarUrl(this.userId())}?v=${this.version()}`;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && file.size > 2 * 1024 * 1024) {
      // basic client-side check
      this.message.set('File too large (max 2 MB).');
      this.selectedFile.set(null);
      return;
    }
    this.message.set('');
    this.selectedFile.set(file);
  }

  upload() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.avatarService.upload(file).subscribe({
      next: () => {
        this.version.set(Date.now()); // forces <img> to reload
        this.message.set('Avatar updated!');
        this.uploading.set(false);
      },
      error: (err) => {
        this.message.set(`Upload failed (${err.status}).`);
        this.uploading.set(false);
      },
    });
  }

  onImageError() {
    // user has no avatar yet (backend probably returned 404)
    this.message.set('No avatar yet.');
  }
}
