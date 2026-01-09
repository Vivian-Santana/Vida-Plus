import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DadosAtualizacaoPaciente } from '../../models/dados-atualizacao-paciente';

@Injectable({ providedIn: 'root' })
export class PacienteService {

  private readonly API = `${environment.apiUrl}pacientes`;

  constructor(private http: HttpClient) {}

  cadastrarPaciente(dados: any): Observable<any> {
    return this.http.post(this.API, dados).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  atualizarPaciente(
    dados: DadosAtualizacaoPaciente
  ): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(this.API, dados, { headers });
  }

}

  