import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../paciente.service';
import { AlertModalComponent } from '../../../shared/alert-modal/alert-modal.component';
import { ModalService } from '../../agendamento/service/modal.service';

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, AlertModalComponent],
  templateUrl: './cadastro-paciente.component.html',
  styleUrl: './cadastro-paciente.component.css'
})
export class CadastroPacienteComponent {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private modalService: ModalService
  ) {
    this.cadastroForm = this.fb.group({
      nome: [''],
      email: [''],
      senha: [''],
      telefone: [''],
      cpf: [''], 

      // Obj endereço
      endereco: this.fb.group({
        logradouro: [''],
        bairro: [''],
        numero: [''],
        complemento: [''],
        cep: [''],
        cidade: [''],
        uf: ['']
      })
    });

  }

  cadastrar() {
    if (this.cadastroForm.invalid) {
      console.warn('Preencha todos os campos obrigatórios');
      return;
    }

    const dados = this.cadastroForm.value;

    this.pacienteService.cadastrarPaciente(dados).subscribe({
      next: (res) => {
        console.log('Paciente cadastrado com sucesso!', res);
        this.modalService.abrirModalSucesso('Cadastro realizado com sucesso!')
        this.cadastroForm.reset();
      },
      error: (err) => {
        console.error('Erro ao cadastrar paciente:', err);
        this.modalService.abrirModalErro('Erro ao cadastrar paciente.')
      }
    });
  }
}
