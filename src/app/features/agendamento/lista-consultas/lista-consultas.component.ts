import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../service/consulta.service';
import { Consulta } from '../agendamento-model/consulta.model';
import { AlertModalComponent } from '../../../shared/alert-modal/alert-modal.component';
import { ModalService } from '../service/modal.service';
import { ConfirmModalComponent } from "../../../shared/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-lista-consultas',
  standalone: true,
  imports: [CommonModule, AlertModalComponent, ConfirmModalComponent],
  templateUrl: './lista-consultas.component.html',
  styleUrl: './lista-consultas.component.css'
})
export class ListaConsultasComponent {

  consultas: Consulta[] = []; //armazena o array de cosultas agendadas
  carregando = false;
  erro: string | null = null;
  consultaParaCancelar: any = null;

    constructor(
      private consultaService: ConsultaService, 
      private modalService: ModalService
    ) {}

    abrirConfirmacao(consulta: any) {
    this.consultaParaCancelar = consulta;
  }

  fecharModal() {
    this.consultaParaCancelar = null;
  }

    ngOnInit(): void {
      this.carregarConsultas();
     }

      carregarConsultas() {
        this.carregando = true;
        this.erro = null;

      this.consultaService.listarMinhasConsultas().subscribe({
        next: (dados: Consulta[]) => {
          this.consultas = dados;
          this.carregando = false;
        },
        error: (err: any) => {
          console.error(err);
          this.erro = 'Erro ao carregar consultas';
          this.carregando = false;
        }
      });

    }

    confirmarCancelamento() {
    if (!this.consultaParaCancelar) return;

    this.consultaService.cancelarConsulta(this.consultaParaCancelar).subscribe({
      next: () => {
        this.consultas = this.consultas.filter(c => c.id !== this.consultaParaCancelar.id);
        this.modalService.abrirModalSucesso('Consulta cancelada com sucesso!');
        this.fecharModal();
      },
      error: (err) => {
        this.modalService.abrirModalErro(this.modalService.handleApiError(err));
        this.fecharModal();
      }
    });
  }

}


