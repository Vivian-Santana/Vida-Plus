// lógica de autenticação e token

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UsuarioLogado } from '../models/usuario-logado.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  usuarioLogado!: UsuarioLogado;

  private apiUrl = 'http://localhost:8080'; // URL da API
  private tokenKey = 'token_jwt'; // chave usada no localStorage

  constructor(private http: HttpClient) { }

  login(login: string, senha: string): Observable<{token: string}>{
    
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { login, senha })
      .pipe(
        tap(response => {
          // API devolve { token: "..." }
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey); // apaga o token
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey); // true se houver token
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey); // usado para Authorization Header
  }

    /** obtém dados do usuário logado **/
  getUsuarioLogado(): Observable<UsuarioLogado | null> {
    const token = this.getToken();
    if (!token) return of(null);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id; // id do usuário no token 
      const userRole = payload.role;

      return this.http.get<any>(`${this.apiUrl}/pacientes/usuarios/${userId}/paciente-id`).pipe(
        map(dados => ({
          id: userId,
          idPaciente: dados.idPaciente, // <- veio do endpoint que pega só o id paciente
          role: userRole,
        })),
        tap(u => {
          console.log('UsuarioLogado construído:', u);
          this.usuarioLogado = u as UsuarioLogado;
        }),
        catchError(err => {
          console.error('Erro ao buscar paciente-id:', err);
          return of(null);
        })
      );
    } catch {
      return of(null);
    }
  }

}

