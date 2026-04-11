import { Routes } from '@angular/router';
import { NotFound } from './core/pages/not-found/not-found';
import { Shell } from './core/layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    loadChildren: () => import('./features/requests/requests.routes').then((m) => m.requestsRoutes),
  },
  { path: '**', component: NotFound },
];
