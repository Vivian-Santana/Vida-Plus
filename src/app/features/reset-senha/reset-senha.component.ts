import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-senha',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-senha.component.html',
  styleUrl: './reset-senha.component.css'
})

export class ResetSenhaComponent {

resetForm: FormGroup;
  mostrarSenha = false;
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;
  carregando = false;
  mostrarModalSucesso = false;
  mostrarModalErro = false;
  mensagemModal = '';


  alternarSenhaAtual() {
    this.mostrarSenhaAtual = !this.mostrarSenhaAtual;
  }

  alternarNovaSenha() {
    this.mostrarNovaSenha = !this.mostrarNovaSenha;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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

    this.carregando = true;

    const { senhaAtual, novaSenha } = this.resetForm.value;
    const payload = { senhaAtual, novaSenha };

    this.authService.resetSenha(payload).subscribe({
      next: () => {
        //console.log('Senha alterada com sucesso!');
        this.mensagemModal = 'Senha alterada com sucesso! Você será redirecionado ao login.';
        this.mostrarModalSucesso = true;
        setTimeout(() => 
          this.router.navigate(['/login']), 4000);
      },
      error: (err: HttpErrorResponse) => {
        //console.error('Erro ao resetar senha', err);
        this.carregando = false;
        this.mensagemModal = err.error?.message || 'Erro ao alterar a senha.';
        this.mostrarModalErro = true;
        setTimeout(() => this.mostrarModalErro = false, 6000);
      }
    });
  }

  get senhaAtual(): AbstractControl | null { return this.resetForm.get('senhaAtual'); }
  get novaSenha(): AbstractControl | null { return this.resetForm.get('novaSenha'); }

}