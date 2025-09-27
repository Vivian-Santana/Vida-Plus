// lógica de autenticação e token

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UsuarioLogado } from '../models/usuario-logado.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  usuarioLogado!: UsuarioLogado | null;

  private apiUrl = 'http://localhost:8080'; // URL da API
  private tokenKey = 'token_jwt'; // chave usada no localStorage
  private usuarioKey = 'usuario_logado';

  constructor(private http: HttpClient) { 
    // Tenta restaurar usuário do localStorage ao iniciar
    const salvo = localStorage.getItem(this.usuarioKey);
    if (salvo) {
      this.usuarioLogado = JSON.parse(salvo);
    }
  }

  login(login: string, senha: string): Observable<{token: string}>{
    
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { login, senha })
      .pipe(
        tap(response => {
            //LIMPA usuário antigo antes de salvar o token novo
          localStorage.removeItem(this.usuarioKey);
          this.usuarioLogado = null;              
          // API devolve { token: "..." }
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey); // apaga o token
    localStorage.removeItem(this.usuarioKey); //limpa também o usuário salvo
    this.usuarioLogado = null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey); // true se houver token
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey); // usado para Authorization Header
  }

  /** método unificado para garantir que sempre tem um usuarioLogado */
  carregarUsuarioLogado(): Observable<UsuarioLogado | null> {
    //Se já está em memória retorna direto
    if (this.usuarioLogado) {
      return of(this.usuarioLogado);
    }

    //Se está no localStorage restaura e retorna
    const salvo = localStorage.getItem(this.usuarioKey);
    if (salvo) {
      this.usuarioLogado = JSON.parse(salvo);
      return of(this.usuarioLogado);
    }

    //Senão, reconstrói via token + endpoint de pegar id de paciente
    const token = this.getToken();
    if (!token) return of(null);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      const userRole = payload.role;

      return this.http.get<any>(`${this.apiUrl}/pacientes/usuarios/${userId}/paciente-id`).pipe(
        map(dados => ({
          id: userId,
          idPaciente: dados.idPaciente,
          role: userRole,
        })),
        tap(u => {
          console.log('UsuarioLogado carregado da API:', u);
          this.usuarioLogado = u as UsuarioLogado;
          localStorage.setItem(this.usuarioKey, JSON.stringify(this.usuarioLogado));
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

    resetSenha(dados: { senhaAtual: string; novaSenha: string }) {
      const token = localStorage.getItem(this.tokenKey);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    return this.http.patch(`${this.apiUrl}/usuarios/reset-senha`, dados, { headers });
  }

}

