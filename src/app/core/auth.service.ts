// lógica de autenticação e token

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

export interface UsuarioLogado {
  id: number;          // extraído do token JWT
  idPaciente?: number;
  role: string;        // extraído do token JWT
  nome: string;        // retornado pela API
  email: string;       // retornado pela API
  telefone: string;    // retornado pela API
  cpf: string;         // retornado pela API
  endereco: any;       // pode tipar depois se tiver um model para Endereco
}


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

    /** obtem dados do usuário logado **/
    getUsuarioLogado(): Observable<UsuarioLogado | null> {
    const token = this.getToken();
    if (!token) return of(null);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id; //id do usuario no token 
      const userRole = payload.role;

      return this.http.get<any>(`${this.apiUrl}/pacientes/usuario/${userId}`).pipe(
        map(dados => ({
          id: userId,
          idPaciente: dados.idPaciente, // <- veio do endpoint
          role: userRole,
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          cpf: dados.cpf,
          endereco: dados.endereco
        })),
        tap(u => this.usuarioLogado = u as UsuarioLogado),
        catchError(() => of(null))
      );
    } catch {
      return of(null);
    }
  }

}

