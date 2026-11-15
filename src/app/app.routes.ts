import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/extrato/extrato.component').then((m) => m.ExtratoComponent),
    title: 'Meu Extrato | Bradesco'
  },
  { path: '**', redirectTo: '' }
];
