import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { ModalService } from '../../../../shared/modal.service';
import { AlertModalComponent } from "../../../../shared/alert-modal/alert-modal.component";
import { CampoObrigatorioDirective } from '../cadastro-paciente/campo-obrigatorio.directive';
import { AuthService } from '../../../../core/auth.service';
import { DadosAtualizacaoPaciente } from '../../models/dados-atualizacao-paciente';
import { take } from 'rxjs';
import { FormLayoutComponent } from "../../../../shared/form-layout/form-layout/form-layout.component";

@Component({
  selector: 'app-atualizar-cadastro',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    AlertModalComponent, 
    CampoObrigatorioDirective, 
    FormLayoutComponent
  ],
  
  templateUrl: './atualizar-cadastro.component.html',
  styleUrls: [
    './atualizar-cadastro.component.css', 
    '../../../../shared/form-layout/forms.css'
  ]
})
export class AtualizarCadastroComponent implements OnInit {
  
  atualizacaoForm!: FormGroup;
  formSubmitted = false;
  private idPaciente!: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pacienteService: PacienteService,
    private readonly authService: AuthService,
    private readonly modalService: ModalService
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
      .pipe(take(1)) //Garante que após receber o ID uma vez, a inscrição morre
      .subscribe(usuario => {
        if (!usuario?.idPaciente) {
          this.modalService.abrirModalErro(
            'Não foi possível identificar o paciente logado.'
          );
          return;
        }
        this.idPaciente = usuario.idPaciente;

        this.atualizacaoForm.patchValue({
          id: usuario.idPaciente
        });
      });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.atualizacaoForm.invalid){
      this.atualizacaoForm.markAllAsTouched();
      this.modalService.abrirModalErro('Preencha todos os campos obrigatórios')
      return;
    }

    this.executarAtualizacao();
  }

  private executarAtualizacao() {
    const dadosAtualizados: DadosAtualizacaoPaciente = this.atualizacaoForm.value;

    this.pacienteService.atualizarPaciente(dadosAtualizados)
      .subscribe({
        next: () => {
            this.modalService.abrirModalSucesso('Cadastro atualizado com sucesso!');
            
            this.formSubmitted = false;
            this.resetForm();
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
    //reseta o formulário e reatribui o id do paciente
    private resetForm(): void {
    this.atualizacaoForm.reset(); // Reseta os valores e o estado (touched, dirty, etc) da instância existente
    this.atualizacaoForm.patchValue({ id: this.idPaciente });
    this.formSubmitted = false; // Reseta o estado de submissão para esconder mensagens de erro do template
  }

}