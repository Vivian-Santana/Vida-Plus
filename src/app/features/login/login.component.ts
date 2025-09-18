import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
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
      next: (response: any) => {
        //getUsuarioLogado() tem q ser chamado logo após o login, para o  idPaciente ser buscado.
          this.authService.getUsuarioLogado().subscribe(usuario => {
        if (usuario) {
          console.log('Usuário logado:', usuario);
        }
      });

       this.router.navigate(['/nova-consulta']); // só navega depois de carregar

        console.log('Login bem-sucedido!', response);
        localStorage.setItem('token_jwt', response.token);// chave usada no interceptor
        
        // Verifica se há uma rota salva
      const redirect = localStorage.getItem('redirecionarAposLogin') || '/agendamentos/consultas';
      localStorage.removeItem('redirecionarAposLogin'); // limpa após usar

      console.log('Redirecionando para:', redirect);
      this.router.navigate([redirect]); // redireciona se login OK
      },
      error: (err) => {
        console.error('Erro no login', err);
        alert('Usuário ou senha inválidos!');
      }
    });

  }

    // helper para o template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
    
}
