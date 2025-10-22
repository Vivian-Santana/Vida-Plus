// src/app/features/agendamento/services/consulta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Consulta } from '../agendamento-model/consulta.model';
import { ModalService } from './modal.service';
import { Medico } from '../../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = 'https://vollmed-production.up.railway.app/'; //http://localhost:8080/
  medicos: any;
  medico: Medico[] = [];

  constructor(private http: HttpClient, private modalService: ModalService) {}

  // Pega consultas sem precisar do id do paciente
  listarMinhasConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}consultas/minhas/consultas`);
  }

  listarMedicos(): Observable<Medico[]> {
    return this.http.get<{ content: Medico[] }>(`${this.apiUrl}medicos`).pipe(
      // map() → transforma os dados emitidos pelo Observable antes de enviar para o componente
      map(response => response.content), //extrai o array content da resposta da API.
      // catchError() → intercepta erros da requisição HTTP
      catchError(erro => {
        return throwError(() => new Error('Erro ao carregar médicos.'));
      })
    );
  }

  agendarConsulta(dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}consultas/agendar-por-nome-medico`, dados).pipe(
      catchError(err => {
        const mensagem = this.modalService.handleApiError(err);

        // tratamento especial
        if (mensagem.includes('já possui outra consulta')) {
          this.modalService.abrirModalErro('O médico já possui outra consulta agendada nesse mesmo horário.');
        } else if (/horário|funcionamento|18:59/.test(mensagem.toLowerCase())) {
          this.modalService.abrirModalErro('O horário selecionado está fora do funcionamento da clínica (seg - sáb. das 7:00 às 18:59).');
        } else {
          this.modalService.abrirModalErro(mensagem);
        }

        return throwError(() => err);
      })
    );
  }
  
    cancelarConsulta(consulta: any): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}consultas/${consulta.id}?motivo=PACIENTE_DESISTIU`;

    return this.http.delete<void>(url, { headers });
  }

}
