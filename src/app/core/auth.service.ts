// lógica de autenticação e token

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

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
}

