import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'reset-senha',
    loadComponent: () => import('./features/reset-senha/reset-senha.component').then(m => m.ResetSenhaComponent)
  },
  {
    path: 'agendamentos',
    loadComponent: () => import('./features/agendamento/agendamentos/agendamentos.component').then(m => m.AgendamentosComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'consultas',
        loadComponent: () => import('./features/agendamento/lista-consultas/lista-consultas.component').then(m => m.ListaConsultasComponent)
      },
      {
        path: 'nova-consulta',
        loadComponent: () => import('./features/agendamento/nova-consulta/nova-consulta.component').then(m => m.NovaConsultaComponent)
      },
      {
        path: '',
        redirectTo: 'consultas',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
