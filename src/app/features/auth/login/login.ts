import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly storageService = inject(StorageService);

  readonly submitError = signal('');

  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    if (this.storageService.hasActiveSession()) {
      this.storageService.logout();
    }

    this.storageService.clearError();
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.submitError.set('Please enter valid credentials.');
      return;
    }

    const value = this.loginForm.getRawValue();
    const isLoggedIn = this.storageService.login(value.username, value.password);

    if (!isLoggedIn) {
      this.submitError.set(this.storageService.error() ?? 'Login failed. Please try again.');
      return;
    }

    this.storageService.clearError();
    this.submitError.set('');

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const target = this.getSafePostLoginTarget(returnUrl);
    this.router.navigateByUrl(target);
  }

  hasError(controlName: keyof typeof this.loginForm.controls, errorName: string) {
    const control = this.loginForm.controls[controlName];
    return control.touched && control.hasError(errorName);
  }

  private getSafePostLoginTarget(returnUrl: string | null): string {
    if (returnUrl && returnUrl.startsWith('/requests')) {
      return returnUrl;
    }

    return '/requests/overview';
  }
}
