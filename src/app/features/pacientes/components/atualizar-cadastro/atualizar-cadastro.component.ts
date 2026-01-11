import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { ModalService } from '../../../agendamento/services/modal.service';
import { AlertModalComponent } from "../../../../shared/alert-modal/alert-modal.component";
import { CampoObrigatorioDirective } from '../cadastro-paciente/campo-obrigatorio.directive';
import { AuthService } from '../../../../core/auth.service';

@Component({
  selector: 'app-atualizar-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AlertModalComponent, CampoObrigatorioDirective],
  templateUrl: './atualizar-cadastro.component.html',
  styleUrl: './atualizar-cadastro.component.css'
})
export class AtualizarCadastroComponent implements OnInit {
  
  atualizacaoForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

    ngOnInit(): void {
    this.criarFormulario();
    this.carregarIdPaciente();
  }

  private criarFormulario() {
      this.atualizacaoForm = this.fb.group({
      id: [null, Validators.required],
      nome: ['', Validators.required],
      telefone: ['', Validators.required],

      endereco: this.fb.group({
        logradouro: ['', Validators.required],
        bairro: ['', Validators.required],
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        cidade: ['', Validators.required],
        uf: ['', Validators.required],
        numero: [''],
        complemento: ['']
      })
    });
  }

  private carregarIdPaciente() {
    this.authService.carregarUsuarioLogado()
      .subscribe(usuario => {
        if (!usuario?.idPaciente) {
          this.modalService.abrirModalErro(
            'Não foi possível identificar o paciente logado.'
          );
          return;
        }

        this.atualizacaoForm.patchValue({
          id: usuario.idPaciente
        });
      });
  }

  atualizar() {
  // console.log('FORM VALUE:', this.atualizacaoForm.value);
  // console.log('FORM STATUS:', this.atualizacaoForm.status);
  // console.log('FORM ERRORS:', this.atualizacaoForm.errors);

    this.formSubmitted = true;
    if (this.atualizacaoForm.invalid){
      this.atualizacaoForm.markAllAsTouched();
      this.modalService.abrirModalErro('Preencha todos os campos obrigatórios')
      return;
    }

    const DadosAtualizados = this.atualizacaoForm.value
    
    this.pacienteService.atualizarPaciente(DadosAtualizados)
      .subscribe({
        next: response => {
            console.log(response);
            this.modalService.abrirModalSucesso('Cadastro atualizado com sucesso!');
        },
        error: err => {
          if (err.status === 400) {
            this.modalService.abrirModalErro('Erro de validação nos dados');
          } else if (err.status === 403) {
            this.modalService.abrirModalErro('Acesso negado');
          }
        }   
      });
  }

}