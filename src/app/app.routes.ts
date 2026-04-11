import { Routes } from '@angular/router';
import { NotFound } from './core/pages/not-found/not-found';
import { Shell } from './core/layout/shell/shell';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login },
  {
    path: 'requests',
    component: Shell,
    canActivate: [authGuard],
    loadChildren: () => import('./features/requests/requests.routes').then((m) => m.requestsRoutes),
  },
  { path: '**', component: NotFound },
];
