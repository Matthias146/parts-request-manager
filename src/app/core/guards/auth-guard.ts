import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (storageService.hasActiveSession()) {
    return true;
  }

  return router.createUrlTree([''], {
    queryParams: { returnUrl: state.url },
  });
};
