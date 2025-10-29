import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ModalService } from '../agendamento/service/modal.service';

@Component({
  selector: 'app-reset-senha',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, AlertModalComponent],
  templateUrl: './reset-senha.component.html',
  styleUrl: './reset-senha.component.css'
})

export class ResetSenhaComponent {

resetForm: FormGroup;
  mostrarSenha = false;
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;

  alternarSenhaAtual() {
    this.mostrarSenhaAtual = !this.mostrarSenhaAtual;
  }

  alternarNovaSenha() {
    this.mostrarNovaSenha = !this.mostrarNovaSenha;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.resetForm = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { senhaAtual, novaSenha } = this.resetForm.value;
    const payload = { senhaAtual, novaSenha };

    this.authService.resetSenha(payload).subscribe({
      next: (res: any) => {
        const mensagem = res?.mensagem || 'Senha alterada com sucesso!';
        this.modalService.abrirModalSucesso(mensagem);
      },
        error: (err: HttpErrorResponse) => {
          const mensagem = err?.error?.erro || 'Erro ao alterar senha. Tente novamente.';
          this.modalService.abrirModalErro(mensagem);
      }
    });
  }

  get senhaAtual(): AbstractControl | null { return this.resetForm.get('senhaAtual'); }
  get novaSenha(): AbstractControl | null { return this.resetForm.get('novaSenha'); }

}