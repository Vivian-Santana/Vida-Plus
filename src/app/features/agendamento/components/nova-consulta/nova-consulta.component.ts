import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { AlertModalComponent } from '../../../../shared/alert-modal/alert-modal.component';
import { ConsultaService } from '../../services/consulta.service';

@Component({
  selector: 'app-nova-consulta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AlertModalComponent],
  templateUrl: './nova-consulta.component.html',
  styleUrl: './nova-consulta.component.css'
})
export class NovaConsultaComponent {

  consultaForm!: FormGroup;
  idPaciente!: number;
  usuarioCarregado = false;

  medicos: any;

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

  //CARREGA O USUÁRIO ASSIM QUE O COMPONENTE INICIA
  ngOnInit(): void {
    this.authService.carregarUsuarioLogado().subscribe(usuario => {
      if (usuario) {
        this.idPaciente = usuario.idPaciente;
        this.usuarioCarregado = true;
        //console.log('idPaciente carregado:', this.idPaciente); //debug
      } else {
        //console.error('Erro: idPaciente não carregado');
      }
    });

    this.carregarMedicos();
  }
  
  carregarMedicos(): void {
    this.consultaService.listarMedicos().subscribe({
      next: (lista) => {
        this.medicos = lista;
      },
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

    this.consultaService.agendarConsulta(payload).subscribe({
      next: () => {
        this.modalService.abrirModalSucesso('Consulta agendada com sucesso!');
        this.consultaForm.reset();
      }
    });
  }
}
