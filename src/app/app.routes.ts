import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ResetSenhaComponent } from './features/reset-senha/reset-senha.component';
import { ListaConsultasComponent } from './features/agendamento/lista-consultas/lista-consultas.component';
import { NovaConsultaComponent } from './features/agendamento/nova-consulta/nova-consulta.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
  { path: 'reset-senha', component: ResetSenhaComponent },
  {
    path: 'agendamentos',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ListaConsultasComponent },
      { path: 'novo', component: NovaConsultaComponent }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
