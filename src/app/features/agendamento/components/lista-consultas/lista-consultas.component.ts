import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../../services/consulta.service';
import { Consulta } from '../../../agendamento/models/Consulta.model';
import { AlertModalComponent } from '../../../../shared/alert-modal/alert-modal.component';
import { ModalService } from '../../../../shared/modal.service';
import { ConfirmModalComponent } from "../../../../shared/confirm-modal/confirm-modal.component";
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-lista-consultas',
  standalone: true,
  imports: [CommonModule, AlertModalComponent, ConfirmModalComponent],
  templateUrl: './lista-consultas.component.html',
  styleUrl: './lista-consultas.component.css'
})
export class ListaConsultasComponent implements OnInit, OnDestroy  {

  consultas: Consulta[] = [];
  carregando = false;
  erro: string | null = null;
  consultaParaCancelar: Consulta | null = null;

  private readonly destroy$ = new Subject<void>();

    constructor(
      private readonly consultaService: ConsultaService, 
      private readonly modalService: ModalService
    ) {}

    ngOnInit(): void {
      this.carregarConsultas();
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

      carregarConsultas(): void {
        this.carregando = true;
        this.erro = null;

      this.consultaService
        .listarMinhasConsultas()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (consultas: Consulta[]) => {
            this.consultas = consultas;
            this.carregando = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.erro = 'Erro ao carregar consultas';
            this.carregando = false;
          }
        });
    }

    abrirConfirmacao(consulta: Consulta): void {
      this.consultaParaCancelar = consulta;
    }

    fecharModal() {
      this.consultaParaCancelar = null;
    }

    confirmarCancelamento(): void {
      if (!this.consultaParaCancelar) return;

    const consultaId = this.consultaParaCancelar.id;

    this.consultaService
      .cancelarConsulta(consultaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.consultas = this.consultas.filter(
            c => c.id !== consultaId
          );

          this.modalService.abrirModalSucesso(
            'Consulta cancelada com sucesso!'
          );

          this.fecharModal();
        },
        error: (err: HttpErrorResponse) => {
          this.modalService.abrirModalErro(
            this.modalService.handleApiError(err)
          );
          this.fecharModal();
        }
      });
  }

}
