import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly API = `${environment.apiUrl}medicos`;

  constructor(private http: HttpClient) {}

  listar(pagina: number = 0, tamanho: number = 10): Observable<any> {

    const params = new HttpParams()
      .set('page', pagina.toString())
      .set('size', tamanho.toString())
      .set('sort', 'nome,asc');

    return this.http.get<any>(this.API, { params });
  }
}
