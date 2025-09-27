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
    console.log('Submit acionado');
    if (this.resetForm.invalid) {
      console.warn('Formulário inválido:', this.resetForm.value);
      this.resetForm.markAllAsTouched();
      return;
    }

    const { senhaAtual, novaSenha } = this.resetForm.value;
    const payload = { senhaAtual, novaSenha };

    console.log('Enviando resetSenha:', payload);

    this.authService.resetSenha(payload).subscribe({
      next: () => {
        console.log('Senha alterada com sucesso!');
        alert('Senha alterada com sucesso!');
        this.router.navigate(['/login']); // Redireciona para login após sucesso
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao resetar senha', err);
        alert(err.error?.message || err.message || 'Erro ao alterar a senha.');
      }
    });
  }

  get senhaAtual(): AbstractControl | null { return this.resetForm.get('senhaAtual'); }
  get novaSenha(): AbstractControl | null { return this.resetForm.get('novaSenha'); }

}