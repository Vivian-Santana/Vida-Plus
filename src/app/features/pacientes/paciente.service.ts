import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PacienteService {

  private readonly API = 'http://localhost:8080/pacientes';

  constructor(private http: HttpClient) {}

  cadastrarPaciente(dados: any): Observable<any> {
    return this.http.post(this.API, dados);
  }
}
