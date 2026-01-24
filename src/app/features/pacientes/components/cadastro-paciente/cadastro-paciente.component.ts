import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { AlertModalComponent } from '../../../../shared/alert-modal/alert-modal.component';
import { ModalService } from '../../../../shared/modal.service';
import { CampoObrigatorioDirective } from './campo-obrigatorio.directive';
import { FormLayoutComponent } from "../../../../shared/form-layout/form-layout/form-layout.component";

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    ReactiveFormsModule, 
    AlertModalComponent, 
    CampoObrigatorioDirective, 
    FormLayoutComponent
  ],
  
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: [
    './cadastro-paciente.component.css',
     '../../../../shared/form-layout/forms.css'
    ]
})
export class CadastroPacienteComponent {
  cadastroForm: FormGroup;
  mostrarSenha: boolean = false;
  formSubmitted = false;

  // mostra/esconde senha
  alternarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private modalService: ModalService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      telefone: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], 

      // Obj endereço
      endereco: this.fb.group({
        logradouro: ['', Validators.required],
        bairro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        cidade: ['', Validators.required],
        uf: ['', Validators.required]
      })
    });

  }

  cadastrar() {
    this.formSubmitted = true;
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.modalService.abrirModalErro('Preencha todos os campos obrigatórios')
      return;
    }

    const dados = this.cadastroForm.value;

    this.pacienteService.cadastrarPaciente(dados).subscribe({
      next: (res) => {
        this.modalService.abrirModalSucesso('Cadastro realizado com sucesso!')
        this.cadastroForm.reset();
      },
      error: (err) => {
        //console.error('Erro ao cadastrar paciente:', err);

        if (err.error && err.error.errors && Array.isArray(err.error.errors)) {
          const mensagens = err.error.errors.map((e: any) => e.defaultMessage).join('\n');
          this.modalService.abrirModalErro(mensagens);
        } else if (err.error && err.error.message) {
          this.modalService.abrirModalErro(err.error.message);
        } else {
          this.modalService.abrirModalErro('Erro ao cadastrar paciente.');
        }
      }
    });
  }
}
