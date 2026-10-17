import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { username, email, password } = this.form.getRawValue();

    this.auth.register(username, email, password).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400 && err.error?.message === 'Email already exists') {
          this.form.get('email')?.setErrors({ emailExists: true });
        }
        if (err.status === 400 && err.error?.message === 'Username already exists') {
          this.form.get('username')?.setErrors({ usernameExists: true });
        }
        this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }
}
