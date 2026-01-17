import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page } from '../models/page.model';
import { Medico } from '../models/medico.model';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly API = `${environment.apiUrl}medicos`;

  constructor(private http: HttpClient) {}

  listar(
    pagina: number = 0, 
    tamanho: number = 10
  ): Observable<Page<Medico>> {

    const params = new HttpParams()
      .set('page', pagina)
      .set('size', tamanho)
      .set('sort', 'nome,asc');

    return this.http.get<Page<Medico>>(this.API, { params });
  }
}
