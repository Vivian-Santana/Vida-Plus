import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginForm: FormGroup;
  mostrarSenha: boolean = false;
  mostrarModalErro = false;
  mensagemModal = '';

  // mostra/esconde senha
  alternarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
      this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // mostra erros de validação
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        //console.log('Login bem-sucedido!', response);

        //o token já é salvo no AuthService.login()

        //chama carregarUsuarioLogado() em vez de getUsuarioLogado()
        this.authService.carregarUsuarioLogado().subscribe(usuario => {
          if (usuario) {
            //console.log('Usuário logado:', usuario);

            //redireciona só depois que usuário é carregado
            const redirect = localStorage.getItem('redirecionarAposLogin') || '/home';
            localStorage.removeItem('redirecionarAposLogin');
            //console.log('Redirecionando para:', redirect);
            this.router.navigate([redirect]);
          } else {
            alert('Erro ao carregar informações do usuário.');
          }
        });
      },
      error: (err) => {
        console.error('Erro no login', err);
        this.mensagemModal = err.error?.message || 'Erro no login. Verifique suas credenciais.';
        this.mostrarModalErro = true;
        setTimeout(() => this.mostrarModalErro = false, 4000);
      }
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
