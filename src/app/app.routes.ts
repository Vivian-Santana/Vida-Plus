import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // abrir sempre em /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  

  // login e reset continuam lazy
  {
    path: 'login',
    loadComponent: () => import('./features/logar/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'reset-senha',
    loadComponent: () => import('./features/reset-senha/reset-senha.component').then(m => m.ResetSenhaComponent)
  },

  // dashboard (card) — só acessível se autenticado
  {
    path: 'home',
    loadComponent: () => import('./features/inicio/components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },

  // lista de consultas (rota acionada ao clicar no card) — também protegida
  {
    path: 'consultas-agendadas',
    loadComponent: () => import('./features/agendamento/components/lista-consultas/lista-consultas.component').then(m => m.ListaConsultasComponent),
    canActivate: [AuthGuard]
  },

  //nova consulta - protegida
  {
    path: 'nova-consulta',
    loadComponent: () => import('./features/agendamento/components/nova-consulta/nova-consulta.component').then(m => m.NovaConsultaComponent),
    canActivate: [AuthGuard]
  },

    //cadastro paciente
  {
    path: 'cadastro-paciente',
    loadComponent: () => import('./features/pacientes/components/cadastro-paciente/cadastro-paciente.component').then(m => m.CadastroPacienteComponent)
  },

  //app-atualizar-cadastro
  {
    path: 'atualizar-cadastro',
    loadComponent: () => import('./features/pacientes/components/atualizar-cadastro/atualizar-cadastro.component').then(m => m.AtualizarCadastroComponent),
    canActivate: [AuthGuard]
  },

  // lista de médicos - protegida
  {
    path: 'medicos',
    loadComponent: () => import('./features/medicos/components/medicos-lista/medicos-lista.component').then(m => m.MedicosListaComponent),
    canActivate: [AuthGuard]
  },

  // fallback
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
