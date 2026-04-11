import { Routes } from '@angular/router';

export const requestsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview').then((m) => m.Overview),
  },
  { path: 'new', loadComponent: () => import('./form/form').then((m) => m.Form) },
];
