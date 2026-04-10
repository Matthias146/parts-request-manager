import { Routes } from '@angular/router';
import { NotFound } from './core/pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/requests/requests.routes').then((m) => m.requestsRoutes),
  },
  { path: '**', component: NotFound },
];
