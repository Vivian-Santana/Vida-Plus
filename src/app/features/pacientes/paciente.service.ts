import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}
