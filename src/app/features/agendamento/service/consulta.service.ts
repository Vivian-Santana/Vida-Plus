// src/app/features/agendamento/services/consulta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = 'http://localhost:8080'; // URL da API

  constructor(private http: HttpClient) {}

  // Chama /consultas sem precisar do id do paciente
  listarMinhasConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consultas/minhas/consultas`);
  }
}
