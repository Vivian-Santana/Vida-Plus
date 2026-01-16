import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { AlertModalComponent } from '../../../../shared/alert-modal/alert-modal.component';
import { ConsultaService } from '../../services/consulta.service';
import { Medico } from '../../../medicos/models/medico.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-nova-consulta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AlertModalComponent],
  templateUrl: './nova-consulta.component.html',
  styleUrl: './nova-consulta.component.css'
})
export class NovaConsultaComponent implements OnInit, OnDestroy{

  consultaForm!: FormGroup;
  idPaciente!: number;
  usuarioCarregado = false;
  medicos: Medico[] = [];

    private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService,
    private consultaService: ConsultaService
  ) {
    this.consultaForm = this.fb.group({
      nomeMedico: [null, Validators.required],
      data: ['', Validators.required],
      especialidade: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.carregarUsuarioLogado()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: usuario => {
        if (usuario) {
          this.idPaciente = usuario.idPaciente;
          this.usuarioCarregado = true;
        }
      },
      error: () => this.modalService.abrirModalErro('Erro ao carregar usuário')
    });

    this.carregarMedicos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  carregarMedicos(): void {
    this.consultaService.listarMedicos()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (lista: Medico[]) => {
        this.medicos = lista;
      }, // erros tratado na ConsultaService
    });
  }

  agendar(): void {
    if (!this.consultaForm.valid || !this.idPaciente) {
      this.modalService.abrirModalErro('Preencha todos os campos obrigatórios antes de continuar.');
      return;
    }

    const payload = {
      ...this.consultaForm.value,
      idPaciente: this.idPaciente
    };

    this.consultaService.agendarConsulta(payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.modalService.abrirModalSucesso('Consulta agendada com sucesso!');
        this.consultaForm.reset();
      }
    }); // erros tratado na ConsultaService
  }
}
