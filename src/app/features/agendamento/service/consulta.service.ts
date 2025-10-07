// src/app/features/agendamento/services/consulta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../agendamento-model/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = 'http://localhost:8080'; // URL da API

  constructor(private http: HttpClient) {}

  // Pega consultas sem precisar do id do paciente
  listarMinhasConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consultas/minhas/consultas`);
  }

  agendarConsulta(dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/consultas`, dados);
  }
  
    cancelarConsulta(consulta: any): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Monta a URL com query string
    const url = `${this.apiUrl}/consultas/${consulta.id}?motivo=PACIENTE_DESISTIU`;

    return this.http.delete<void>(url, { headers });
  }

}
