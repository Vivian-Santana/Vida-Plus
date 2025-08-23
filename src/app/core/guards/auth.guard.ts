// controle de acesso às rotas.

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

// Esse guarda a rota antes de ativar a rota
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('token_jwt');

    if (token) {
      return true; // Usuário autenticado
    }

    // Salva a URL que o usuário tentou acessar
    localStorage.setItem('redirecionarAposLogin', state.url);

    // Redireciona para login
    return this.router.parseUrl('/login');
  }
}
