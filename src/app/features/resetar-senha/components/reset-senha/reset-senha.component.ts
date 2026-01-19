import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertModalComponent } from '../../../../shared/alert-modal/alert-modal.component';
import { ModalService } from '../../../../shared/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { ResetSenhaRequest, ResetSenhaResponse } from '../../models/reset-senha.model';

@Component({
  selector: 'app-reset-senha',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, AlertModalComponent],
  templateUrl: './reset-senha.component.html',
  styleUrl: './reset-senha.component.css'
})

export class ResetSenhaComponent implements OnInit, OnDestroy {
  
  resetForm!: FormGroup;
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;

  private readonly destroy$ = new Subject<void>();
  
  constructor(
      private readonly fb: FormBuilder,
      private readonly authService: AuthService,
      private readonly modalService: ModalService,
      private readonly router: Router
    ) {}

  ngOnInit(): void {
    this.criarFormulario();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private criarFormulario(): void {
    this.resetForm = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
  alternarSenhaAtual(): void {
    this.mostrarSenhaAtual = !this.mostrarSenhaAtual;
  }

  alternarNovaSenha(): void {
    this.mostrarNovaSenha = !this.mostrarNovaSenha;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const payload: ResetSenhaRequest = this.resetForm.value;

    this.authService
    .resetSenha(payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: ResetSenhaResponse) => {

        setTimeout(() => {
          this.modalService.abrirModalSucesso(
            res?.mensagem || 'Senha alterada com sucesso! Você será redirecionado para o login.'
          );
        }, 1000);
        this.resetForm.reset();

        setTimeout(() => {
          //desconecta o usuário e redireciona para o login
        this.authService.logout(); // Limpa localStorage e memória
        this.router.navigate(['/login']);
        }, 5000);
        
      },
      error: (err: HttpErrorResponse) => {
        this.modalService.abrirModalErro(
            err?.error?.erro || 'Erro ao alterar senha. Tente novamente.'
        );  
      }
    });
  }

  get senhaAtual(): AbstractControl | null { 
    return this.resetForm.get('senhaAtual');
  }

  get novaSenha(): AbstractControl | null { 
    return this.resetForm.get('novaSenha'); 
  }

}