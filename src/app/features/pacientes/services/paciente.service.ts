import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DadosAtualizacaoPaciente } from '../models/dados-atualizacao-paciente';

@Injectable({ providedIn: 'root' })
export class PacienteService {

  private readonly API = `${environment.apiUrl}pacientes`;

  constructor(private http: HttpClient) {}

  cadastrarPaciente(dados: DadosAtualizacaoPaciente): Observable<DadosAtualizacaoPaciente> {
    return this.http.post<DadosAtualizacaoPaciente>(this.API, dados).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  atualizarPaciente(
    dados: DadosAtualizacaoPaciente
  ): Observable<DadosAtualizacaoPaciente> {
    return this.http.put<DadosAtualizacaoPaciente>(this.API, dados);
  }

}

  