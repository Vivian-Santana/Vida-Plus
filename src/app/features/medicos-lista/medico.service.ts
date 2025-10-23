import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private apiUrl = 'https://vollmed-production.up.railway.app/medicos'; //'http://localhost:8080/medicos'

  constructor(private http: HttpClient) {}

  listar(pagina: number = 0, tamanho: number = 10): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('page', pagina.toString())
      .set('size', tamanho.toString())
      .set('sort', 'nome,asc');

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
}
