import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth.service';
import { Router, RouterModule } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../../../shared/modal.service';
import { AlertModalComponent } from '../../../../shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, AlertModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  mostrarSenha: boolean = false;

  readonly loginForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) {
    this.loginForm = this.fb.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // mostra/esconde senha
  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // mostra erros de validação
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password)
        .pipe(
          switchMap(() => this.authService.carregarUsuarioLogado()),
          filter(usuario => !!usuario)
        )
        .subscribe({
        next: () => {
          const redirect = 
            localStorage.getItem('redirecionarAposLogin') || '/home';
            localStorage.removeItem('redirecionarAposLogin');
            this.router.navigate([redirect]);
          },
          error: (err: HttpErrorResponse) => {
            this.modalService.abrirModalErro (
              err.error?.message || 'Usuário ou senha inválidos.'
            );
             // limpa os campos
              this.loginForm.reset();

              // remove estados de erro/dirty
              this.loginForm.markAsPristine();
              this.loginForm.markAsUntouched();
          }
        });
  }

  get username() { 
    return this.loginForm.controls['username'];
  }

  get password() {
     return this.loginForm.controls['password']; 
    }
}
