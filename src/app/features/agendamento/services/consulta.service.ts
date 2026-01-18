// src/app/features/agendamento/services/consulta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Consulta } from '../../agendamento/models/consulta.model';
import { ModalService } from '../../../shared/modal.service';
import { Medico } from '../../medicos/models/medico.model';
import { environment } from '../../../../environments/environment';
import { AgendamentoConsulta} from '../models/AgendamentoConsulta.model';


@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient, 
    private readonly modalService: ModalService) {}

  // Pega consultas sem precisar do id do paciente
  listarMinhasConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}consultas/minhas/consultas`).pipe(
      catchError(this.tratarErro)
    );
  }

  listarMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${this.apiUrl}medicos/todos`).pipe(
      catchError(() => {
        return throwError(() => new Error('Erro ao carregar médicos.'));
      })
    );
  }

  agendarConsulta(dados: AgendamentoConsulta): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.apiUrl}consultas/agendar-por-nome-medico`, dados).pipe(
      catchError((err: HttpErrorResponse) => {
        const mensagem = this.modalService.handleApiError(err);

        // tratamento especial
        if (mensagem.includes('já possui outra consulta')) {
          this.modalService.abrirModalErro(
            'O médico já possui outra consulta agendada nesse mesmo horário.'
          );
        } else if (/horário|funcionamento|18:59/.test(mensagem.toLowerCase())) {
          this.modalService.abrirModalErro(
            'O horário selecionado está fora do funcionamento da clínica (seg - sáb. das 7:00 às 18:59).'
          );
        } else {
          this.modalService.abrirModalErro(mensagem);
        }

        return throwError(() => err);
      })
    );
  }
  
    cancelarConsulta(id: number): Observable<void> {
    const url = `${this.apiUrl}consultas/${id}?motivo=PACIENTE_DESISTIU`;
    return this.http.delete<void>(url).pipe(
      catchError(this.tratarErro)
    );
  }

  // Método para tratar erros genéricos
  private tratarErro = (err: HttpErrorResponse): Observable<never> => {
    console.error('Erro na API:', err);
    this.modalService.abrirModalErro('Ocorreu um erro inesperado. Tente novamente.');
    return throwError(() => err);
  };

}
